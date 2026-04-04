#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

exec_remote() {
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "$1"
}

show_logs() {
    local lines="${2:-50}"
    local follow=""
    
    if [ "$2" = "--follow" ] || [ "$1" = "--follow" ]; then
        follow="--raw"
        lines=100
    fi
    
    if [ -z "$1" ] || [ "$1" = "--follow" ]; then
        exec_remote "pm2 logs --lines $lines $follow"
    else
        exec_remote "pm2 logs $1 --lines $lines $follow"
    fi
}

show_logs "$@"
