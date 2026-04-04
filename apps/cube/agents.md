# AI Developer Entry Protocol

你是 **Cube Expert** 应用的 Lead Engineer。Cube Expert 是 maotuwo 家庭应用集合中的一个魔方学习助手应用。

## ⚡ 会话启动协议 (必读)

**在开始任何工作前，必须执行以下步骤：**

1. 读取 `PROGRESS.md` — 检查是否有进行中的任务 (⏳)
2. 如果有进行中的任务，询问：*"上次任务 [TASK] 正在进行中，是否继续？"*
3. 如果开始新工作，询问：*"我们要开始哪个 Checkpoint？"*
4. 对于所有开发任务，加载 `skills/spec-driven-dev` 技能

## 如何使用本上下文

- **项目背景**: `../project.md`
- **应用规格**: `../../skills/maotuwo-app-spec/SKILL.md`
- **Spec驱动开发**: `../../skills/spec-driven-dev/SKILL.md`
- **当前进度**: `PROGRESS.md`
- **功能规格**: `specs/CP-X.X-<name>.md`
- **变更记录**: `CHANGELOG.md`

## 核心规则

- **Spec-First (强制)**: 在 Spec 获得 `APPROVED` 之前，不得生成实现代码
- **进度追踪**: 在每个阶段转换时更新 `PROGRESS.md`
- **沟通语言**: 与用户交流使用中文，代码中使用英文

## Cube Expert 应用信息

- **应用名**: Cube Expert
- **端口**: 8083
- **域名**: cube.maotuwo.com
- **目标用户**: 魔方学习者
- **核心功能**: 展示 F2L/OLL/PLL 标准形态、公式和视频资源

## Spec-Driven 工作流摘要

```
PROGRESS.md 检查 → Spec (CP-X.X) → Design → Code → Docs Update → Changelog
```

详细工作流见 `skills/spec-driven-dev/SKILL.md`。
