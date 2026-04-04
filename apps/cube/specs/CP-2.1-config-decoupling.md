# CP-2.1: Data Decoupling & Configuration JSON

## 1. 核心目标 (Purpose)
代码即代码，数据即数据。摒弃在 `src/data/f2l.ts`, `oll.ts`, `pll.ts` 内编写海量且不易阅读维护的硬编码(Hardcoded)魔方公式字符串。引入彻底的**前后端数据解耦原则**，采用一整套纯净的内置 JSON 文件承载所有默认公式。

## 2. 功能要求 (Features)

### 2.1 依赖抽象分离 (Dependency Abstraction)
- **底层架空**：清空 `f2l.ts`, `oll.ts`, `pll.ts` 里塞满的 120 条 `formulas` 数据结构代码。这些 ts 脚本应当仅仅作为纯函数，依据序列或字母表动态推导出 120 个只含有 `id, name, alias, imgSrc` 等不变常量的“空皮囊（Bare structural skeleton）”。
  
### 2.2 核心数据文件下放 (JSON Configuration Setup)
- **内置原厂配置 (Default Config)**：在工程中创立 `src/data/default_formulas.json`。它的格式与我们在 CP-2.0 设计的极致修剪、高可读性、带有版本控制的 `BackupData` (导出 JSON) 的标准范式**完全一模一样**！
- 把当前由我编写整理好的几十套顶级 F2L/OLL/PLL 标准主公式序列化录入到这个标准的 JSON 文件中，作为工厂默认配置库出厂。

### 2.3 启动与合并挂载 (Bootstrapping & Payload Merging)
在 `<CaseProvider>` 初始化整个 App 时，遵循优先级递增的**三级水层渲染映射架构**：
1. **第一底座层**：生成 120 套无任何公式、只有 ID 和图片的纯净 `CubeCase` 骨架矩阵。
2. **第二工厂默认配置层**：自动导入静态资源 `default_formulas.json`，调用类似于 `parseBackup` 的无伤融合算法，把标准公式映射到第一层的骨架内，形成 App 的出场默认状态。
3. **第三层持久定制层**：向后校验浏览器的 `LocalStorage` 探针（缓存库），如果发现有用户自己以前深度编辑的特化数据包，则使用它**覆盖性抹掉**前两层的同 `id` 属性。从而保证用户的定制化永远是最高优先权重。

## 3. 验收标准
- [ ] TypeScript 构建文件极其规整简短，再也不见包含大量字符的 `olls` 等魔方公式魔法常量数组。
- [ ] 成功使用符合 CP-2.0 Backup Schema 标准的 `default_formulas.json` 替代替代硬写入逻辑跑通全盘。
- [ ] LocalStorage 若清空时，App 不会崩溃，必定能读出预设原厂配置展示给客户。
