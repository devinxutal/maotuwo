#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/../host_info"

connect() {
    ssh -o ConnectTimeout=10 -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}"
}

check() {
    echo -n "Testing SSH connection to ${ECS_USER}@${ECS_HOST}... "
    ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i "$SSH_KEY" "${ECS_USER}@${ECS_HOST}" "echo 'OK'" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "Success"
        return 0
    else
        echo "Failed"
        return 1
    fi
}

case "$1" in
    check)
        check
        ;;
    connect|"")
        connect
        ;;
    *)
        echo "Usage: $0 {check|connect}"
        exit 1
        ;;
esac
