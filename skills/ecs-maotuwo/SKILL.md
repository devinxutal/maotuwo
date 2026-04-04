---
name: ecs-maotuwo
description: |
  Manages Aliyun ECS server (8.130.44.101) for connection, remote control, and basic server operations. 
  Use this skill when you need to:
  - Connect to the ECS server via SSH
  - Execute commands on the remote server
  - Check server status (disk, memory, CPU)
  - View PM2 process status and logs
  - Initialize new server environment
  - Troubleshoot server connectivity issues
  - Restart or stop services (without deploying new code)
  
  Do NOT use this skill for application deployment - use the 'maotuwo-app-deploy' skill instead.
  
  Example triggers: "连接服务器查看状态", "SSH连不上怎么办", "服务器内存不足", "查看PM2日志", "重启服务器"
---

# ECS Maotuwo Skill

本技能提供阿里云 ECS 服务器的连接、远程控制和基础运维能力，不负责具体应用部署。

## 服务器信息

- **IP**: 8.130.44.101
- **用户**: maotuwo
- **部署目录**: /home/maotuwo/deployment
- **SSH密钥**: ssh-keys/id_rsa

## 核心工具

### SSH 连接

```bash
# 测试连接
./scripts/ssh.sh check

# 直接 SSH 登录
./scripts/ssh.sh connect
```

### 远程命令执行

```bash
# 执行单条命令
./scripts/remote.sh exec "pm2 status"

# 执行多条命令
./scripts/remote.sh exec "df -h && free -h"
```

### 服务器状态

```bash
./scripts/remote.sh status
```

这会显示：
- PM2 进程状态
- 磁盘使用情况
- 内存使用情况

### 日志查看

```bash
# 所有日志 (最近50行)
./scripts/remote.sh logs

# 指定应用
./scripts/remote.sh logs abc-client
./scripts/remote.sh logs abc-server

# 实时查看
./scripts/remote.sh logs --follow
```

### 服务管理

```bash
# 重启所有 PM2 服务
./scripts/remote.sh restart

# 停止所有服务
./scripts/remote.sh stop

# 启动特定服务
./scripts/remote.sh start abc-server
```

## 初始化服务器

仅在服务器首次创建时运行：

```bash
./scripts/init.sh
```

这会安装：
- Docker + Docker Compose
- NPM 和 PNPM
- PM2 进程管理器

## 故障排查

### SSH 连接问题

```bash
# 调试连接
ssh -vvv -i ssh-keys/id_rsa maotuwo@8.130.44.101

# 检查密钥权限
ls -la ssh-keys/id_rsa  # 应该只有所有者可读写 (600)
```

### 服务异常

```bash
# 查看详细日志
./scripts/remote.sh logs abc-server --lines 200

# 重启特定服务
./scripts/remote.sh restart abc-server

# 查看资源占用
./scripts/remote.sh exec "top -bn1 | head -20"
```

### Nginx 异常

```bash
./scripts/remote.sh exec "sudo nginx -t"
./scripts/remote.sh exec "sudo systemctl status nginx"
./scripts/remote.sh exec "sudo systemctl restart nginx"
```

## 服务架构 (供参考)

```
Nginx (80/443)
    ├── /api -> localhost:9000 (abc-server)
    └── /* -> localhost:3000 (abc-client)
```

## 安全注意事项

- `ssh-keys/id_rsa` 是私钥文件，请妥善保管
- 不要将私钥提交到公共仓库
- SSH 密钥文件权限必须是 600

## 文件结构

```
ecs-maotuwo/
├── SKILL.md
├── host_info              # 服务器配置
├── ssh-keys/
│   ├── id_rsa            # SSH 私钥
│   └── id_rsa.pub        # SSH 公钥
└── scripts/
    ├── ssh.sh            # SSH 连接工具
    ├── remote.sh         # 远程命令执行
    ├── status.sh         # 服务器状态
    ├── logs.sh           # 日志查看
    ├── service.sh        # 服务管理
    └── init.sh           # 服务器初始化
```
