#!/bin/bash
# Runs instance's first boot (cloud-init) 
# Output: /var/log/cloud-init-output.log
set -euxo pipefail

# Rotate container logs. Written before Docker is installed
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'JSON'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "5" } }
JSON

# Docker Engine and the Compose plugin, from Docker's apt repository
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y git docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Needed for deploy.sh to read Parameter Store
snap install aws-cli --classic

# 2 GB swap
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

git clone https://github.com/BetaNYC/nyc-boundaries.git /opt/boundaries
