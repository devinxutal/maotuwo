#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

exec_remote() {
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "$1"
}

echo "=== PM2 Status ==="
exec_remote "pm2 status"
echo ""
echo "=== Disk Usage ==="
exec_remote "df -h"
echo ""
echo "=== Memory Usage ==="
exec_remote "free -h"
echo ""
echo "=== Load Average ==="
exec_remote "uptime"
