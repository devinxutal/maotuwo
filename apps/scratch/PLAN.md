# Maotuwo Scratch Application Plan

这是 Maotuwo 家庭服务中 Scratch 应用的整体开发计划，旨在基于 `scratch-editor` 提供可本地托管运作的模块版本。

## 整体进度概览

所有的实施均遵循 `maotuwo-app-spec` 和 `spec-driven-dev` 标准规范。每一步将拆分为特定 Checkpoint (CP) 进行追踪与验证，实时状态记录于 `PROGRESS.md` 中。

### CP-1.1: 基础环境搭建与跑通 (初始化) —— 【已完成】
- **目标**: 将开源的 scratch-editor 仓库克隆到本地，配置本地 Node 依赖，并将其启动端口设定为符合 Maotuwo 的 `8011`。
- **完成项**:
  - 剔除了原始 `.git` 隔离。
  - 提供了统一化部署的 `README.md` 与追踪体系（`CHANGELOG.md`, `PROGRESS.md`）。
  - 修通了底层依赖以及 Webpack 构建（剔除 husky 强依赖，确保 npm start 等指令可以脱离底层 Github 上下文直接运行）。

### CP-1.2: 环境与界面定制化 (App Customization) —— 【待开始】
- **目标**: 清理多余或无法本地调用的外部模块，调整文案和主题以融入 Maotuwo。
- **计划内容**:
  - **精简界面**: 隐藏或移除需要 Scratch 官网账号或后端的功能，例如“登录”、“探讨”等跳转项（如存在）。
  - **定制标题与标识**: 更换应用内的左上角或网站 Title，使其标识为 "Maotuwo 版 Scratch"。

### CP-1.3: ECS 本地部署配置 (Deployment Config) —— 【规划中】
- **目标**: 提供上线投产所必须的环境配置。
- **计划内容**:
  - 构建生产版本，提供 `pm2 + serve` 或 `Docker` 自动化启动脚本。
  - 提供反向代理模版文件并在宿主 ECS 配置 `scratch.maotuwo.com` 代理。

---
*注：各个 Checkpoint 的详细 Spec 定义将储存在 `specs/` 目录中。*
