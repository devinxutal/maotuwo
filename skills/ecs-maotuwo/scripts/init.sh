#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

echo "=== Initializing ECS Server ==="
echo "Host: $ECS_HOST"
echo "User: $ECS_USER"

exec_remote() {
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "$1"
}

echo ""
echo "Installing Docker..."
exec_remote "sudo apt-get update && sudo apt-get install -y docker-compose"

echo ""
echo "Configuring Docker registry mirror..."
exec_remote "sudo mkdir -p /etc/docker && sudo tee /etc/docker/daemon.json <<-'EOF'
{
  \"registry-mirrors\": [
    \"https://registry.cn-hangzhou.aliyuncs.com\"
  ]
}
EOF"

exec_remote "sudo systemctl daemon-reload && sudo systemctl restart docker"

echo ""
echo "Installing Node.js tools..."
exec_remote "sudo apt-get install -y npm && sudo npm install -g pm2 pnpm --registry=https://registry.npmmirror.com/"

echo ""
echo "Creating deployment directory..."
exec_remote "mkdir -p $DEPLOYMENT_DIR"

echo ""
echo "Initialization complete!"
echo "Next steps:"
echo "1. 使用 maotuwo-app-deploy 技能部署应用到服务器"
