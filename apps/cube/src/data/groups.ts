export interface FormulaGroup {
  name: string;
  caseIds: string[];
}

export const OLL_GROUPS: FormulaGroup[] = [
  {
    name: "十字组",
    caseIds: ["oll-21", "oll-22", "oll-23", "oll-24", "oll-25", "oll-26", "oll-27"]
  },
  {
    name: "简单组",
    caseIds: ["oll-33", "oll-43", "oll-44", "oll-45", "oll-47", "oll-48", "oll-51"]
  },
  {
    name: "小鱼相关",
    caseIds: ["oll-1", "oll-2", "oll-3", "oll-4", "oll-5", "oll-6", "oll-7", "oll-8"]
  },
  {
    name: "第四组",
    caseIds: ["oll-18", "oll-19", "oll-20", "oll-35", "oll-37", "oll-49", "oll-50", "oll-53", "oll-54"]
  },
  {
    name: "第五组",
    caseIds: ["oll-9", "oll-10", "oll-11", "oll-12", "oll-28", "oll-34", "oll-36", "oll-38", "oll-46", "oll-57"]
  },
  {
    name: "第六组",
    caseIds: ["oll-29", "oll-30", "oll-31", "oll-32", "oll-39", "oll-40", "oll-41", "oll-42"]
  },
  {
    name: "第七组",
    caseIds: ["oll-13", "oll-14", "oll-15", "oll-16", "oll-17", "oll-52", "oll-55", "oll-56"]
  }
];

export const PLL_GROUPS: FormulaGroup[] = [
  {
    name: "基础组",
    caseIds: ["pll-ua", "pll-ub", "pll-aa", "pll-ab", "pll-h", "pll-z", "pll-e"]
  },
  {
    name: "关键组",
    caseIds: ["pll-t", "pll-y", "pll-f", "pll-v", "pll-ja", "pll-jb", "pll-ra", "pll-rb"]
  },
  {
    name: "较难组",
    caseIds: ["pll-na", "pll-nb", "pll-ga", "pll-gb", "pll-gc", "pll-gd"]
  }
];

export const ORDERED_OLL_IDS = OLL_GROUPS.flatMap(g => g.caseIds);
export const ORDERED_PLL_IDS = PLL_GROUPS.flatMap(g => g.caseIds);
