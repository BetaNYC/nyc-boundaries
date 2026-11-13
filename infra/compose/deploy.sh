#!/bin/bash
# Deploy one commit on the server. Run as root (sudo in an SSM session; SSM send-command already is),
# after /opt/boundaries has been checked out at that commit:
#
#   git -C /opt/boundaries fetch && git -C /opt/boundaries checkout <sha>
#   /opt/boundaries/infra/compose/deploy.sh <sha>
#
# The checkout stays outside this script: bash reads a script while running it, so checking out a
# new version of this file mid-run could execute a mix of old and new lines.
set -euo pipefail

sha=${1:?usage: deploy.sh <git-sha>}
cd "$(dirname "$0")"

# Check full SHA
sha=$(git rev-parse "$sha^{commit}")

# The images must match the compose files on disk
if [ "$(git rev-parse HEAD)" != "$sha" ]; then
  echo "deploy.sh: checked-out commit is $(git rev-parse --short HEAD), not $sha" >&2
  exit 1
fi

# Every /boundaries/NAME parameter becomes NAME='value'. Single quotes make Compose read the value
# literally ($ and # intact), so a value must not contain a single quote. umask 077: root-only file.
umask 077
aws ssm get-parameters-by-path --region us-east-1 --path /boundaries --with-decryption \
  --query 'Parameters[].[Name,Value]' --output text |
  sed "s|^/boundaries/||; s|\t|='|; s|\$|'|" > .env.new
# In .env, not just this shell, so a later hand-run `docker compose` uses the same image
echo "IMAGE_TAG=$sha" >> .env.new
# The monitoring services need a Linux host; locally (Docker Desktop) they stay off
echo "COMPOSE_PROFILES=monitoring" >> .env.new

# Pull with the new values before switching to them. This fails on a missing required value (the :?
# checks in compose.yaml) or a missing image, leaving the current .env and the running stack untouched.
docker compose --env-file .env.new pull
mv .env.new .env

# --no-build: never build on the server, even if an image somehow went missing
docker compose up -d --no-build

# `up` doesn't notice an edited config file. A restart re-attaches the mount
docker compose restart prometheus loki alloy grafana

# Caddy serves production, so it reloads instead of restarting
# An invalid Caddyfile fails the deploy while Caddy keeps the old config
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile

# Each deploy leaves the previous API image behind; any old one can be pulled again from GHCR
docker image prune -af
