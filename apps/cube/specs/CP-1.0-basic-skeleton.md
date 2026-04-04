# CP-1.0: Basic App Skeleton & Navigation

## 1. Purpose
配置应用的基础骨架，加入基本的上层导航（Tabs），以便用户能在 F2L, OLL, PLL 三个阶段之间来回切换。此版本只需跑通一个空的外壳，不包含具体的公式数据。

## 2. Scope
- React应用基础的架构搭建。
- 引入 `react-router-dom` 并配置基础路由：`/` (首页), `/f2l`, `/oll`, `/pll`。
- 首页设计：分为三个巨大的可点击区块，分别导向三个阶段。
- 全局导航：针对非首页（如 `/f2l`）增加返回按钮，并保持移动端风格的标题。
- 每个阶段展示简单的占位内容以供验证路由流转。

## 3. Interface Contract & Data Flow
- 此版本纯静态前端导航。无后端数据接口，无复杂的全局状态。

## 4. Acceptance Criteria
- [ ] 开发环境 `npm run dev` 正常启动，没有 Console 报错以及 Ts 编译报错。
- [ ] 顶部导航能够正常展示项目名称 "Cube Expert"，非首页提供返回按钮。
- [ ] 首页 `/` 提供三个巨大的板块，点击分别进入 F2L, OLL, PLL 阶段。
- [ ] 浏览器直接输入 `/` 显示首页。

## 5. Dependencies
- react-router-dom

## 6. Implementation Notes
- 采用 Mobile-first 布局（`max-w-md mx-auto` 控制在电脑端查看时的最大宽度以模拟手机显示效果）。
- 首页 `/` 使用 `flex-column` 搭配大按键平分可用屏幕，提供巨大的 `Link` 触控热区分别路由至对应阶段。
- 构建了带有后退按键并适配移动端居中标题栏风格的 `Header`。
