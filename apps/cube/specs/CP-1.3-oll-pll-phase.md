# CP-1.3: OLL & PLL Phase Implementation

## 1. 核心目标 (Purpose)
在 `F2L` 配置上备受好评的“交互式公式查看+编辑”业务逻辑基础上，快速将 `OLL`（57种） 与 `PLL`（21种） 全部铺开覆盖，正式完结整个 CFOP 指南的魔方图鉴部分。

## 2. 功能细节要求

### 2.1 抽象复用与统一架构 (Generic Architecture)
- 将现有的独立详情页做通用化抽象，挂载统配路由： `/:phase/:id`。
- 退回按钮根据数据系列动态返回到 `/f2l` 或 `/oll` 或 `/pll`。
- 详情页底部的滑动画廊自动隔离展示所属的 Phase。
- **统一数据模型**：拓展 `CubeCase` 数据字典，使其除了纯流水号排序以外，还可无缝兼容真实标准字母命名（即 `alias` 拓展名）。让 F2L、OLL 和 PLL 在底层保留完全一模一样的高拓展性结构，绝不仅为个例搞特殊！

### 2.2 OLL (Orientation of the Last Layer)
- 维持 `1` 到 `57` 的数字为主命名配置。
- 填充 57 种形态的预置公式数组（默认展示规范，用户可编辑）。

### 2.3 PLL (Permutation of Last Layer)
- 利用本地已经放置好的 21 张 PLL 标准图，通过我们的 Python 透明化处理脚本一次性将其打通为真透明，适配全局黑暗/明亮底色。
- **命名结构统一兼容**：在底层数据表中，将这 21 套 PLL 形态运用“纯编号 + Alias 标准字母拓展”双向共存的方法结构化录入，统一映射 `Aa, Ab, E, F, Ga, Gb, Gc, Gd, H, Ja, Jb, Na, Nb, Ra, Rb, T, Ua, Ub, V, Y, Z` 一共 21 个标准标识。

## 3. 验收标准
- [ ] 成功调用本地现有的全套 PLL 图片并通过透明度清洗。
- [ ] 升级底层 `CubeCase` 数据引擎以无伤兼容 Number + Alias 结构。
- [ ] OLL列表和PLL列表完美加载，点击进入 FormulaDetailPage 可以随意游走，增删改查。
