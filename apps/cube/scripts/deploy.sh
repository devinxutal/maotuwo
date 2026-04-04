#!/usr/bin/env bash
set -e

# 获取脚本所在目录以计算绝对的基础路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$DIR")"

echo "==> 1. 构建完全静态应用..."
cd "$APP_DIR"
npm run build

echo "==> 2. 准备服务器部署目录..."
SSH_KEY="../../skills/ecs-maotuwo/ssh-keys/id_rsa"
SERVER="maotuwo@8.130.44.101"

# 确保目标文件夹一定存在
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "mkdir -p /home/maotuwo/deployment/cube"

echo "==> 3. 推送静态资源..."
# rsync 或 scp 推送
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" dist/ $SERVER:/home/maotuwo/deployment/cube/

echo "==> 4. 驱动后台 Web 访问 (PM2)..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "pm2 describe cube > /dev/null && pm2 restart cube || pm2 start 'serve -s /home/maotuwo/deployment/cube -l 8002' --name cube"

echo "==> 代码和进程部署完成！如 Nginx 已配好，则可直接访问体验。"
