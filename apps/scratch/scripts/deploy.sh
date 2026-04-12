#!/bin/bash
set -e

# ==========================================
# Maotuwo Low-Bandwidth Scratch Deploy Script
# ==========================================

# 1. Variables
REMOTE_USER="maotuwo"
REMOTE_IP="8.130.44.101"
REMOTE_PATH="/home/maotuwo/deployment/scratch"
KEY_PATH="../../skills/ecs-maotuwo/ssh-keys/id_rsa"
BUILD_DIR="scratch-editor/packages/scratch-gui/build"

echo "============================================="
echo "  Maotuwo Local -> Remote Zero-Bandwidth Deploy "
echo "============================================="

# 2. Local Build (Heavy lifting done locally)
echo "🚀 [1/3] Starting local production build (Minifying assets)..."
cd scratch-editor/packages/scratch-gui
export NODE_ENV=production
export PATH="/opt/homebrew/bin:$PATH"
export BUILD_TYPE=dev
npx webpack --mode production
cd ../../../

# 3. Compress and Transfer
echo "📦 [2/3] Packing and transferring to ECS server..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 $REMOTE_USER@$REMOTE_IP "mkdir -p $REMOTE_PATH"

echo "   -> Compressing build directory..."
tar -czf build.tar.gz -C scratch-editor/packages/scratch-gui/ build/

echo "   -> Transferring build.tar.gz via Rsync..."
rsync -avP -e "ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=5" build.tar.gz $REMOTE_USER@$REMOTE_IP:$REMOTE_PATH/

echo "   -> Extracting on server..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 $REMOTE_USER@$REMOTE_IP "cd $REMOTE_PATH && tar -xzf build.tar.gz && rm build.tar.gz"

echo "   -> Cleaning up local archive..."
rm build.tar.gz

# 4. Remote Hook (Restart/Boot the static daemon)
echo "⚙️ [3/3] Reloading ECS web service via PM2..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_IP << 'EOF'
  cd /home/maotuwo/deployment/scratch
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  
  if pm2 describe scratch > /dev/null 2>&1; then
    pm2 restart scratch
  else
    pm2 start 'serve -s ./build -l 8011' --name scratch
  fi
  pm2 save
EOF

echo "✅ Deployment Successful!"
echo "➡️ Application is serving on ECS PM2: http://$REMOTE_IP:8011 (Forwarded to maotuwo domain logic)"
