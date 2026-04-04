export interface Formula {
  id: string; // 唯一ID
  expression: string; // 公式文本例如 R U R' U'
  tag: string; // 备注，像 "左手", "背后"
  spin?: number;
}

export interface CubeCase {
  id: string; // e.g., 'f2l-1'
  name: string; // 显示名称
  alias?: string; // 用于兼容 PLL 字母标态等，如 "Ga", "Nb"
  imgSrc: string; // 图片地址
  formulas: Formula[]; // 关联的所有公式
  mainFormulaId: string | null; // 主选公式
}
