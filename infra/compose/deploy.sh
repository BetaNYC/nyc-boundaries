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

# The images must match the compose files on disk
if [ "$(git rev-parse HEAD)" != "$(git rev-parse "$sha^{commit}")" ]; then
  echo "deploy.sh: checked-out commit is $(git rev-parse --short HEAD), not $sha" >&2
  exit 1
fi

# Every /boundaries/NAME parameter becomes NAME=value. umask 077: only root can read the file.
umask 077
aws ssm get-parameters-by-path --region us-east-1 --path /boundaries --with-decryption \
  --query 'Parameters[].[Name,Value]' --output text |
  sed 's|^/boundaries/||; s|\t|=|' > .env.new
# In .env, not just this shell, so a later hand-run `docker compose` uses the same image
echo "IMAGE_TAG=$sha" >> .env.new

# Fails if a required value is missing (the :? checks in compose.yaml), leaving the current .env
# and the running stack untouched
docker compose --env-file .env.new config -q
mv .env.new .env

docker compose pull
docker compose up -d

# Each deploy leaves the previous API image behind; any old one can be pulled again from GHCR
docker image prune -af
