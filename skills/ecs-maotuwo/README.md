# ECS Maotuwo Skill

阿里云 ECS 服务器连接、远程控制和基础运维技能（不含应用部署）。

## 快速开始

```bash
cd skills/ecs-maotuwo

# 测试SSH连接
./scripts/ssh.sh check

# 查看服务器状态
./scripts/status.sh

# 查看日志
./scripts/logs.sh
./scripts/logs.sh abc-server
```

## 脚本说明

- `scripts/ssh.sh` - SSH 连接工具
- `scripts/remote.sh` - 远程执行命令
- `scripts/status.sh` - 服务器状态
- `scripts/logs.sh` - PM2 日志查看
- `scripts/service.sh` - 服务管理
- `scripts/init.sh` - 服务器初始化

## 应用部署

使用 `maotuwo-app-deploy` 技能进行应用部署。
