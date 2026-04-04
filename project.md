# MAOTUWO Project Specification

## 1. 项目概述 (Project Overview)

maotuwo 是猫兔窝一系列家庭 Web 应用的合集，部署在阿里云 ECS 上。每个应用独立运行，通过子域名访问。

## 2. 技术栈 (Tech Stack)

- **运行环境**: 阿里云 ECS (8.130.44.101)
- **前端**: React / Vite (按需)
- **后端**: Node.js (按需)
- **部署**: Docker, PM2 + serve
- **反向代理**: Nginx
- **域名**: *.maotuwo.com

## 3. 现有应用 (Existing Apps)

| 应用 | 域名 | 端口 | 类型 |
|------|------|------|------|
| abc | maotuwo.com | 3000, 9000 | 全栈 |
| trident | trident.maotuwo.com | 8081 | 后端服务 |

详见 [maotuwo-app-spec 技能](../skills/maotuwo-app-spec/SKILL.md)

## 4. Spec-Driven 开发模式

项目采用 Spec-Driven 开发模式：

- **以 App 为粒度**: 每个应用独立开发
- **Spec-First**: 任何功能开发前，必须创建对应的 `.md` 文档
- **Checkpoint 管理**: 每个应用的功能点拆分为多个 Checkpoint
- **进度追踪**: 使用 `PROGRESS.md` 追踪每个应用的开发状态

详见 `skills/spec-driven-dev/SKILL.md`

## 5. 语言规范

- **代码注释**: 英文
- **开发文档**: 中文
- **对话交流**: 中文
