# Maotuwo Scratch Application Plan

这是 Maotuwo 家庭服务中 Scratch 应用的整体开发计划，旨在基于 `scratch-editor` 提供可本地托管运作的模块版本。

## 整体进度概览

所有的实施均遵循 `maotuwo-app-spec` 和 `spec-driven-dev` 标准规范。每一步将拆分为特定 Checkpoint (CP) 进行追踪与验证，实时状态记录于 `PROGRESS.md` 中。

### CP-1.1: 基础环境搭建与跑通 (初始化) —— 【已完成】
- **目标**: 将开源的 scratch-editor 仓库克隆到本地，配置本地 Node 依赖，并将其启动端口设定为符合 Maotuwo 的 `8011`。

### CP-1.2: ECS 低带宽自动化部署 (Low-bandwidth Deployment) —— 【进行中】
- **目标**: 提供上线投产所必须的环境配置，采用本地打包+增量部署以最大程度绕开服务器带宽瓶颈。
- **计划内容**:
  - 编写本地一键打包+部署脚本 `scripts/deploy.sh`，利用本机的私钥与 ECS (8.130.44.101) 直接握手。
  - 配置传输流式压缩 `rsync`。
  - 在 ECS 端提供自动化拉起 `pm2 serve` 到 `8011` 端口的执行钩子。

### CP-1.3: 环境与界面定制化 (App Customization) —— 【规划中】
- **目标**: 实现简单的项目保存/加载功能
- **计划内容**: 
  - 在File菜单中增加“保存至云端”和“从云端加载”两个按钮
  - 保存是用户可选择输入简单文件名
  - 文档保存至服务器本地
