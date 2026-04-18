# CP-1.3: 项目云存储功能 (Cloud Project Storage)

> **Status**: `APPROVED`
> **Created**: 2026-04-18
> **Last Updated**: 2026-04-18

---

## 1. Purpose

为 Scratch 编辑器添加简单的项目保存/加载功能，允许用户将作品保存到服务器本地文件系统，并在之后加载继续编辑。

---

## 2. Scope

### In Scope
- 在 Scratch GUI 的 File 菜单中添加两个新选项：
  - "保存至云端" (Save to Cloud)
  - "从云端加载" (Load from Cloud)
- 保存时弹出对话框让用户输入文件名
- 后端 API 服务处理文件读写（保存到服务器本地文件系统）
- 项目文件存储在 `/home/maotuwo/scratch-projects/` 目录

### Out of Scope
- 用户认证系统（单用户家庭环境，无需登录）
- 项目分享功能
- 版本历史管理
- 多用户冲突处理

---

## 3. Interface Contract

### API Endpoints

#### POST /api/projects/save
保存项目到服务器

**Request:**
```json
{
  "filename": "my-game",
  "projectData": { /* Scratch project JSON */ }
}
```

**Response:**
```json
{
  "success": true,
  "filename": "my-game.sb3",
  "savedAt": "2026-04-18T10:30:00Z"
}
```

#### GET /api/projects/list
获取已保存的项目列表

**Response:**
```json
{
  "projects": [
    { "filename": "my-game.sb3", "savedAt": "2026-04-18T10:30:00Z", "size": 15234 },
    { "filename": "animation.sb3", "savedAt": "2026-04-17T15:20:00Z", "size": 8901 }
  ]
}
```

#### GET /api/projects/load/:filename
加载指定项目

**Response:** Project JSON data

### File Storage
- **Path**: `/home/maotuwo/scratch-projects/`
- **Format**: `.sb3` (ZIP compressed Scratch 3.0 project)

---

## 4. Acceptance Criteria

- [ ] AC-1: File 菜单显示 "保存至云端" 和 "从云端加载" 选项
- [ ] AC-2: 点击保存弹出文件名输入对话框
- [ ] AC-3: 项目成功保存到服务器 `/home/maotuwo/scratch-projects/`
- [ ] AC-4: 点击加载显示已保存项目列表，选择后加载成功
- [ ] AC-5: 加载的项目可以正常编辑和再次保存

---

## 5. Dependencies

- Depends on: `CP-1.2` (部署基础设施)
- Blocks: None

---

## Design

### Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Scratch GUI    │────▶│  Express API    │────▶│  File System    │
│  (React)        │◀────│  (Node.js)      │◀────│  (/scratch-     │
│                 │     │  Port 8012      │     │   projects/)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend Changes
1. **Menu Bar**: 修改 `MenuBar` 组件，添加新菜单项
2. **Save Dialog**: 创建文件名输入对话框组件
3. **Load Dialog**: 创建项目列表选择对话框组件
4. **API Client**: 创建 API 调用模块

### Backend Service
- **Server**: Express.js on port 8012
- **Endpoints**: `/api/projects/*`
- **CORS**: 允许来自 localhost:8011 的请求

---

## Implementation Notes

> *Filled in after implementation.*
