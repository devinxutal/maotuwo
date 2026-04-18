#!/bin/bash
set -e

# ==========================================
# Maotuwo Low-Bandwidth Scratch Deploy Script
# ==========================================

# 1. Variables
REMOTE_USER="maotuwo"
REMOTE_IP="8.130.44.101"
REMOTE_PATH="/home/maotuwo/deployment/scratch"
SERVER_PATH="/home/maotuwo/scratch-server"
KEY_PATH="../../skills/ecs-maotuwo/ssh-keys/id_rsa"
BUILD_DIR="scratch-editor/packages/scratch-gui/build"

echo "============================================="
echo "  Maotuwo Local -> Remote Zero-Bandwidth Deploy "
echo "============================================="

# 2. Local Build (Heavy lifting done locally)
echo "🚀 [1/4] Starting local production build (Minifying assets)..."
cd scratch-editor/packages/scratch-gui

# Ensure dependencies are built (vm, render, etc.)
echo "   -> Building workspace dependencies..."
cd ../..
npm run build

# Build the GUI playground to 'build/' directory
echo "   -> Building scratch-gui playground..."
cd packages/scratch-gui
npm run build:dev

cd ../../../

# 3. Compress and Transfer Frontend
echo "📦 [2/4] Packing and transferring frontend to ECS server..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 $REMOTE_USER@$REMOTE_IP "mkdir -p $REMOTE_PATH"

echo "   -> Compressing build directory..."
tar -czf build.tar.gz -C scratch-editor/packages/scratch-gui/ build/

echo "   -> Transferring build.tar.gz via Rsync..."
rsync -avP -e "ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=5" build.tar.gz $REMOTE_USER@$REMOTE_IP:$REMOTE_PATH/

echo "   -> Extracting on server..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -o ServerAliveInterval=15 $REMOTE_USER@$REMOTE_IP "cd $REMOTE_PATH && tar -xzf build.tar.gz && rm build.tar.gz"

echo "   -> Cleaning up local archive..."
rm build.tar.gz

# 4. Transfer Backend Server
echo "📦 [3/4] Transferring backend API server..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_IP "mkdir -p $SERVER_PATH"

# Sync server files (excluding node_modules)
echo "   -> Syncing server files..."
rsync -avz --delete \
  -e "ssh -i $KEY_PATH -o StrictHostKeyChecking=no" \
  --exclude='node_modules' \
  --exclude='data' \
  server/ $REMOTE_USER@$REMOTE_IP:$SERVER_PATH/

# 5. Remote Hook (Restart/Boot services)
echo "⚙️ [4/4] Reloading ECS services via PM2..."
ssh -i $KEY_PATH -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_IP << EOF
  export NVM_DIR="\$HOME/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
  
  # Install backend dependencies if needed
  cd $SERVER_PATH
  if [ ! -d "node_modules" ]; then
    echo "   -> Installing backend dependencies..."
    npm install
  fi
  
  # Create data directory
  mkdir -p data
  
  # Restart or start backend API
  if pm2 describe scratch-api > /dev/null 2>&1; then
    echo "   -> Restarting scratch-api..."
    pm2 restart scratch-api
  else
    echo "   -> Starting scratch-api..."
    pm2 start index.js --name scratch-api -- --port 8012
  fi
  
  # Restart or start frontend
  cd $REMOTE_PATH
  if pm2 describe scratch > /dev/null 2>&1; then
    echo "   -> Restarting scratch frontend..."
    pm2 restart scratch
  else
    echo "   -> Starting scratch frontend..."
    pm2 start 'serve -s ./build -l 8011' --name scratch
  fi
  
  pm2 save
EOF

echo ""
echo "✅ Deployment Successful!"
echo "➡️ Frontend: http://$REMOTE_IP:8011"
echo "➡️ Backend API: http://$REMOTE_IP:8012"
