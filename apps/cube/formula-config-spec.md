# Cube App Formula Configuration Specification

本文档定义了魔方公式系统的核心数据配置（JSON）解耦规范。它不仅是全应用底层的运行时工厂默认配置格式规则（如 `src/data/default_formulas.json`），也是对外系统级导入与导出的高聚合标准凭据。

## 1. 设计初衷 (Purpose)
为实现“代码即结构，配置即记录”的重度前后端架构分离模式，抛弃在前端 `.ts` 文件内硬编码（Hardcode）数百条复杂的常态魔方公式（F2L, OLL, PLL）。现在，前端业务底座将自身降维成负责挂载 ID 与图片的极其单纯的映射模板骨架，核心所有承载打乱算法的数学字符统统让权移交至符合 `Human-Readable` 标准的 JSON 文件池内。

## 2. JSON Schema 规范定义
该配置文件需彻底具备横向与纵向拓展性，任何数据的外围最外层必须包裹严谨的根参数（版本控制等），绝不可直接裸写公式数组：

```json
{
  "version": 1,                  // 数据模型版本号（当前强制校验应为 1）
  "timestamp": "ISO-8601-Date",  // 导出/打包生成的时间标记
  "data": {                      // Key 字典模型
    "f2l-1": {                   // 键名为 CubeCase 所属的全球绝对唯一系统 ID
      "mainFormulaId": "f1-1",   // 激活或官方推荐的主选公式引用的 id
      "formulas": [              // 无极拓展的候选方案清单 Array 
        {
          "id": "f1-1",
          "expression": "U (R U' R')",  // 最纯净剔除额外描述的独立魔方推演字符
          "tag": "标准主公式",            // 对应用户备注分类，例如“左手公式”、“背向视角”
          "spin": 90                    // (可选) 针对基础标态图片的顺时针预调整角度。缺省时等效为 0。
        }
      ]
    }
  }
}
```

## 3. 根系统 ID 规范映射集 (Global Phase ID Binding)
任何 JSON `data` 区块如果需要顺利覆盖，对应的 Key 值必须满足以下命名系统规范：
- **F2L 字典**: 自 `f2l-1` 严密递增排布至 `f2l-41`
- **OLL 字典**: 自 `oll-1` 严密递增排布至 `oll-57`
- **PLL 字典**: 取缔所有数字，全域采用国际标准盲拧形态的缩写标记（强制转换为极简全小写格式识别）。仅可包含 `21` 种合法参数：`pll-aa`, `pll-ab`, `pll-e`, `pll-f`, `pll-ga`, `pll-gb`, `pll-gc`, `pll-gd`, `pll-h`, `pll-ja`, `pll-jb`, `pll-na`, `pll-nb`, `pll-ra`, `pll-rb`, `pll-t`, `pll-ua`, `pll-ub`, `pll-v`, `pll-y`, `pll-z`。

## 4. 三层映射水层逻辑 (Architecture Override Rules)
当 App 被推送到客户端启动挂载时：
1. **纯净骨架推衍层 (Source Barebones)**：应用最底层首先通过纯算法（1-41 的 Map）快速生出近 120 个毫无公式仅携带预处理静态渲染环境的基础模板。
2. **官方 JSON 并集层 (Factory Defaults Layer)**：应用启动拉入 `default_formulas.json` 的所有上述规范 `data` 数据。凡是在底本骨架和 `data` 里 `key` 吻合的子项，发生一次底层合并注入。所有标准的官方配置开始就位。
3. **用户覆盖沙盘优先层 (Client Preference Storage)**：此时侦测校验使用客户端自带浏览器的 `LocalStorage` 或者上传动作，只要该缓存 JSON 有同名的 `version: 1` 和更活跃的项，将无条件抹除官方推荐的对应键值环境。

这个架构实现了终极配置高自由：你甚至可以向所有朋友分发你个人特制版的一套高阶 JSON 文件。替换工程文件内一份 JSON 后点击发布，直接能更迭一套完全不同的解法系统。
