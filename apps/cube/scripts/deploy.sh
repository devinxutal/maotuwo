#!/usr/bin/env bash
set -e

# 获取脚本所在目录以计算绝对的基础路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$DIR")"

SSH_KEY="../../skills/ecs-maotuwo/ssh-keys/id_rsa"
SERVER="maotuwo@8.130.44.101"

echo "==> 1. 构建前端静态应用..."
cd "$APP_DIR"
npm run build

echo "==> 2. 准备服务器部署目录..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "mkdir -p /home/maotuwo/deployment/cube /home/maotuwo/deployment/cube-api /home/maotuwo/deployment/cube-data/profiles"

echo "==> 3. 推送前端静态资源..."
rsync -avz -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" dist/ $SERVER:/home/maotuwo/deployment/cube/

echo "==> 4. 推送 API 服务端代码..."
rsync -avz --exclude='node_modules' -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" server/ $SERVER:/home/maotuwo/deployment/cube-api/

echo "==> 5. 服务端安装依赖..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "cd /home/maotuwo/deployment/cube-api && npm install --production"

echo "==> 6. 启动/重启后台服务 (PM2)..."
# 前端静态服务
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "pm2 describe cube > /dev/null && pm2 restart cube || pm2 start 'serve -s /home/maotuwo/deployment/cube -l 8002' --name cube"
# API 服务
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "cd /home/maotuwo/deployment/cube-api && CUBE_DATA_DIR=/home/maotuwo/deployment/cube-data/profiles pm2 describe cube-api > /dev/null && CUBE_DATA_DIR=/home/maotuwo/deployment/cube-data/profiles pm2 restart cube-api || CUBE_DATA_DIR=/home/maotuwo/deployment/cube-data/profiles pm2 start index.js --name cube-api"

echo "==> 7. 保存 PM2 进程列表..."
ssh -i $SSH_KEY -o StrictHostKeyChecking=no $SERVER "pm2 save"

echo "==> 部署完成！前端: 8002, API: 8003"
