# Cube

Cube 是一个用于记录和展示魔方 CFOP 各个标准形态及其公式的独立前端应用。

## 项目需求
该应用旨在提供清晰的魔方公式速查体验，具备以下核心特性：
1. **阶段展示**：涵盖 CFOP 的主要阶段——F2L、OLL、PLL。主导航能够切换这三个阶段。
2. **形态查看**：进入某个阶段后，展示该阶段所有的标准形态，并附有直观的形态示意图。
3. **公式详情与编辑**：点击具体的标准形态后，展示对应的操作公式。公式应当支持自定义编辑，并允许添加 Alternative Formula（备用公式）。

## 本地开发
```bash
npm run dev
```

该命令将在本地启动带有热更新的 `Vite` 服务器（约占 `localhost:5173` 或其它预留端口）。

## 🚀 ECS 生产部署与运维

本项目严格遵循猫兔窝统一的服务器架构（见 `maotuwo-app-spec`）。整个服务基于纯静态构建 + PM2 Serve 进程守护架构：

1. **一键部署代码至远端**：
   直接执行预设在 `scripts/deploy.sh` 内的管线即可（需要授权私钥存放在 `skills/ecs-maotuwo/ssh-keys/` 内）：
   ```bash
   bash scripts/deploy.sh
   ```
   *底层逻辑：本地构建 `dist`，利用 `rsync` 推送增量到云端 `/home/maotuwo/deployment/cube/`，并重启绑定在局域网 `8002` 端口上的 `PM2` 进程。*

2. **Nginx 域名路由（首次部署需到服务器手动配置一次）**：
   由于权限限制，Nginx 配置需在远程服务器上手动干预建立。推荐的 `/etc/nginx/sites-available/cube` 配置参考如下：
   ```nginx
   server {
       listen 80;
       server_name cube.maotuwo.com;

       location / {
           proxy_pass http://127.0.0.1:8002;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
   配置好后连结生效策略：
   ```bash
   sudo ln -sf /etc/nginx/sites-available/cube /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

## 项目骨架
- **技术栈**：Vite + React + TypeScript
- **设计风格**：Mobile-first（移动端优先），应用整体布局与交互逻辑将贴近原生手机 App。
- **样式**：Tailwind CSS
- **架构**：纯静态前端应用，状态保存在本地（如 LocalStorage），无需后端服务。
