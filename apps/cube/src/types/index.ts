export type CFOPStep = 'F2L' | 'OLL' | 'PLL';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface CFOPCase {
  id: string;
  step: CFOPStep;
  name: string;
  alias: string[];
  description: string;
  formula: string;
  videoUrl?: string;
  difficulty: Difficulty;
  tags: string[];
}

export interface CaseGroup {
  step: CFOPStep;
  name: string;
  description: string;
  caseCount: number;
}

export const STEP_INFO: Record<CFOPStep, CaseGroup> = {
  F2L: {
    step: 'F2L',
    name: 'First Two Layers',
    description: '同时还原前两层，包含41种标准形态',
    caseCount: 41,
  },
  OLL: {
    step: 'OLL',
    name: 'Orient Last Layer',
    description: '使顶层所有面块朝向正确，包含57种标准形态',
    caseCount: 57,
  },
  PLL: {
    step: 'PLL',
    name: 'Permute Last Layer',
    description: '交换顶层位置使魔方完全还原，包含21种标准形态',
    caseCount: 21,
  },
};
