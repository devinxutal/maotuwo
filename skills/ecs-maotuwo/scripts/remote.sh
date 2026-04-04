#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

exec_remote() {
    ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "$1"
}

case "$1" in
    exec)
        shift
        exec_remote "$*"
        ;;
    *)
        echo "Usage: $0 exec <command>"
        exit 1
        ;;
esac
