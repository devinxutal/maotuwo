# CP-4.0 — Cloud Profile Storage

## Purpose
将 Cube Expert 的数据持久化从浏览器 localStorage 迁移至云端服务器文件存储，并引入 **Profile（用户配置档案）** 概念，支持多用户独立配置空间。

## Scope
- 新增轻量级 Node.js API 服务（Express），与 Cube 静态站共存
- 前端 `CaseContext` 完全重写为云端驱动，不再依赖 localStorage
- 每次前端修改自动 sync 到服务端
- 导入/导出功能保留，导入时覆盖当前 profile 的云端数据
- 新增 Profile 选择器 UI，预置 5 个 profile

## Interface Contract

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/profiles` | 返回所有 profile 名称列表 |
| `GET` | `/api/profiles/:name` | 获取指定 profile 的完整配置 |
| `PUT` | `/api/profiles/:name` | 完整覆写指定 profile（导入/还原） |
| `PATCH` | `/api/profiles/:name` | 局部更新（单个 case 的 formulas 变更） |

### Request/Response Schema

```jsonc
// GET /api/profiles
{ "profiles": ["public", "loki", "gloria", "eric", "sunny"], "active": "public" }

// GET /api/profiles/:name
// Response = 现有 formula-config-spec 的 JSON 格式 (version + data)
{ "version": 1, "timestamp": "...", "data": { "f2l-1": {...}, ... } }

// PUT /api/profiles/:name  (Body = 完整配置 JSON)
// PATCH /api/profiles/:name (Body = { caseId: "oll-3", mainFormulaId: "...", formulas: [...] })
```

### Server-Side Storage
```
/home/maotuwo/deployment/cube-data/
├── profiles/
│   ├── public.json
│   ├── loki.json
│   ├── gloria.json
│   ├── eric.json
│   └── sunny.json
```
每个 profile 文件格式与现有 `formula-config-spec` 完全一致。首次创建时从 `default_formulas.json` 复制初始内容。

### Profile 行为规则
1. 打开 App 默认激活 `public` profile
2. 选择 profile 后，localStorage 仅记录 `activeProfile` 名称
3. 所有数据操作（展示/编辑/导入/导出/还原）仅针对当前 profile
4. Profile 切换时前端重新从服务端拉取对应配置

## Dependencies
- Node.js (v18+, 服务器已有)
- Express.js (npm install on server)
- 现有 deploy.sh 需更新以部署 API 服务

## Acceptance Criteria
- [ ] App 启动后从 `/api/profiles/:name` 加载数据，不再读 localStorage
- [ ] 编辑公式后自动 PATCH 到服务端，刷新后数据不丢失
- [ ] 导入 JSON 时 PUT 覆盖当前 profile 的云端数据
- [ ] 导出 JSON 下载当前 profile 的数据
- [ ] 还原默认配置重置当前 profile 为内置默认值
- [ ] Profile 切换器在配置面板中可用，切换后数据即时刷新
- [ ] 5 个预置 profile (public/loki/gloria/eric/sunny) 可独立工作
