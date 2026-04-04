#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

exec_remote() {
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "$1"
}

case "$1" in
    restart)
        echo "Restarting all PM2 services..."
        exec_remote "pm2 restart all"
        ;;
    stop)
        echo "Stopping all PM2 services..."
        exec_remote "pm2 delete all 2>/dev/null || true"
        ;;
    start)
        if [ -z "$2" ]; then
            echo "Usage: $0 start <app-name>"
            exit 1
        fi
        echo "Starting $2..."
        exec_remote "pm2 start $2"
        ;;
    delete)
        if [ -z "$2" ]; then
            echo "Usage: $0 delete <app-name>"
            exit 1
        fi
        echo "Deleting $2..."
        exec_remote "pm2 delete $2"
        ;;
    reload|graceful)
        echo "Reloading all PM2 services (graceful)..."
        exec_remote "pm2 reload all"
        ;;
    *)
        echo "Usage: $0 {restart|stop|start|delete|reload} [app-name]"
        echo ""
        echo "Commands:"
        echo "  restart    Restart all PM2 services"
        echo "  stop       Stop all PM2 services"
        echo "  start      Start a specific PM2 service"
        echo "  delete     Delete a specific PM2 service"
        echo "  reload     Gracefully reload all services"
        exit 1
        ;;
esac
