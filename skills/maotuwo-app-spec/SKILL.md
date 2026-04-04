---
name: maotuwo-app-spec
description: |
  Maotuwo family app specification and architecture knowledge base. Contains app inventory (abc, trident, etc.), port conventions (8000-8100), nginx configuration standards, and deployment best practices.
  
  Use this skill when you need to:
  - Understand maotuwo app architecture
  - Know existing apps and their configurations
  - Get port assignments for new apps
  - Configure nginx reverse proxy
  - Learn deployment modes (Docker vs PM2)
  
  Actual deployment operations are handled by the 'ecs-maotuwo' skill.
  
  Example triggers: "maotuwo应用架构", "新增应用端口规划", "nginx反向代理怎么配", "trident用的是什么端口"
---

# Maotuwo App Spec

猫兔窝家庭应用规格说明，沉淀架构设计和部署规范。

> 所有部署和管理操作通过 `ecs-maotuwo` 技能执行，本技能仅提供规格知识。

## 概述

maotuwo 是猫兔窝一系列家庭 Web 应用的合集，部署在阿里云 ECS 上。每个应用独立运行，用户通过子域名访问。

### 架构图

```
                            ┌─────────────────────────────────────┐
                            │              Aliyun ECS              │
                            │                                     │
Internet ──► Nginx ────────►│ <app>.maotuwo.com ──► :8081        │
        (80/443)            │                                     │
                            │         Docker Containers            │
                            │         (隔离运行)                  │
                            │                                     │
                            └─────────────────────────────────────┘
```

### 设计原则

1. **独立性**：每个应用独立部署，无依赖关系
2. **隔离性**：使用 Docker 容器隔离运行环境
3. **简洁性**：可选 PM2 + serve 简化静态前端部署

## 现有应用

| 应用 | 域名 | 端口 | 类型 | 说明 |
|------|------|------|------|------|
| abc | maotuwo.com | 3000, 9000 | 全栈 | ABC 应用 (API + 前端) |
| trident | trident.maotuwo.com | 8081 | 后端服务 | Trident 主服务 |
| trident-fluidd | fluidd.maotuwo.com | 8081 | 前端 | Fluidd 控制面板 |

### 应用目录

```
/home/maotuwo/
├── abc/              # ABC 全栈应用
├── deployment/       # 静态资源部署目录
└── ...
```

## 端口规范

### 已分配端口

| 端口 | 应用 | 用途 |
|------|------|------|
| 3000 | abc | 前端服务 |
| 8081 | trident | Trident 后端 API |
| 9000 | abc | ABC API 服务 |

### 新应用端口范围

**8000-8100** (预留端口池)

```
8000-8100: 新应用端口池
  ├── 8000: 预留
  ├── 8001: app-name-1
  └── ...
```

## 域名规范

### 格式

```
<app-name>.maotuwo.com
```

### DNS 配置

```
maotuwo.com          → A 记录 → 8.130.44.101
*.maotuwo.com        → CNAME  → maotuwo.com
```

## Nginx 配置规范

### 配置位置

```
/etc/nginx/sites-available/<app-name>     # 配置文件
/etc/nginx/sites-enabled/<app-name>         # 启用链接
```

### 基本模板

```nginx
server {
    listen 80;
    server_name <app-name>.maotuwo.com;

    location / {
        proxy_pass http://127.0.0.1:<PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 带 WebSocket 支持

```nginx
server {
    listen 80;
    server_name <app-name>.maotuwo.com;

    location /websocket {
        proxy_pass http://127.0.0.1:<PORT>/websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }

    location / {
        proxy_pass http://127.0.0.1:<PORT>;
    }
}
```

### 启用站点

```bash
sudo ln -sf /etc/nginx/sites-available/<app-name> /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 部署模式

### Docker 模式 (推荐)

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "8001:8001"
    networks:
      - app_network

networks:
  app_network:
    driver: bridge
```

### PM2 + Serve 模式 (轻量级)

适用于纯静态前端：

```bash
pm2 start 'serve -s ./build -l 8002' --name <app-name>
```

## 目录结构

```
/home/maotuwo/
├── <app-name>/           # 应用代码
│   ├── client/           # 前端代码
│   ├── server/           # 后端代码
│   └── docker-compose.yml
│
└── deployment/           # 静态资源
    └── <app-name>/       # 构建产物
```

## 安全考虑

### HTTP Basic Auth

```nginx
auth_basic "Restricted";
auth_basic_user_file /etc/nginx/0-passwords.txt;
```

### SSL/TLS

生产环境建议启用 HTTPS。

## 新增应用清单

1. **本文档** - 添加到 "现有应用" 表
2. **Nginx 配置** - 创建 `/etc/nginx/sites-available/<app-name>`
3. **DNS** - 添加子域名解析
4. **端口分配** - 选择 8000-8100 范围内的空闲端口

## 相关

- [ecs-maotuwo 技能](../ecs-maotuwo/SKILL.md) - ECS 连接和部署执行
