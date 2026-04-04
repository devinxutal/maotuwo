import type { CFOPCase } from '../types';

export const f2lCases: CFOPCase[] = [
  {
    id: 'F2L-01',
    step: 'F2L',
    name: 'Right Trigger',
    alias: ['RT', '标准块'],
    description: '最基础的F2L情况，棱块和角块颜色都朝上',
    formula: 'U R U\' R\'',
    difficulty: 1,
    tags: ['基础', '右手'],
  },
  {
    id: 'F2L-02',
    step: 'F2L',
    name: 'Left Trigger',
    alias: ['LT', '左手'],
    description: '左手版本的触发公式',
    formula: 'U\' L\' U L',
    difficulty: 1,
    tags: ['基础', '左手'],
  },
  {
    id: 'F2L-03',
    step: 'F2L',
    name: 'Right Sune',
    alias: ['RS', '右Sune'],
    description: '棱块在右侧槽位，角块需要翻转',
    formula: 'R U R\' U\' R U R\'',
    difficulty: 2,
    tags: ['翻转', '右'],
  },
  {
    id: 'F2L-04',
    step: 'F2L',
    name: 'Left Sune',
    alias: ['LS', '左Sune'],
    description: '左手版本的Sune公式',
    formula: 'L\' U\' L U\' L\' U L',
    difficulty: 2,
    tags: ['翻转', '左'],
  },
  {
    id: 'F2L-05',
    step: 'F2L',
    name: 'Back Sune',
    alias: ['BS'],
    description: '棱块在后面槽位的Sune',
    formula: 'U\' R U2 R\' U\' R U\' R\'',
    difficulty: 2,
    tags: ['翻转', '后'],
  },
];

export const ollCases: CFOPCase[] = [
  {
    id: 'OLL-01',
    step: 'OLL',
    name: 'Dot',
    alias: ['点'],
    description: '顶层没有任何面块颜色朝上',
    formula: 'F R U R\' U\' F\'',
    difficulty: 1,
    tags: ['点'],
  },
  {
    id: 'OLL-02',
    step: 'OLL',
    name: 'Small L Shape',
    alias: ['小L', 'L'],
    description: '两个相邻面块颜色朝上形成L形',
    formula: 'f R U R\' U\' f\'',
    difficulty: 2,
    tags: ['L形'],
  },
  {
    id: 'OLL-03',
    step: 'OLL',
    name: 'Line',
    alias: ['直线', 'I'],
    description: '两个相对面块颜色朝上形成直线',
    formula: 'F R U R\' U\' F\'',
    difficulty: 1,
    tags: ['直线'],
  },
];

export const pllCases: CFOPCase[] = [
  {
    id: 'PLL-01',
    step: 'PLL',
    name: 'Aa Perm',
    alias: ['A顺时针', 'A顺'],
    description: '两个相邻角块交换位置',
    formula: 'R\' F R\' B2 R F\' R\' B2 R2',
    difficulty: 2,
    tags: ['角块', '顺时针'],
  },
  {
    id: 'PLL-02',
    step: 'PLL',
    name: 'Ab Perm',
    alias: ['A逆时针', 'A逆'],
    description: '两个相邻角块交换位置（反向）',
    formula: 'R B\' R F2 R\' B R F2 R2',
    difficulty: 2,
    tags: ['角块', '逆时针'],
  },
  {
    id: 'PLL-03',
    step: 'PLL',
    name: 'T Perm',
    alias: ['T置换'],
    description: '两个相邻棱块交换位置',
    formula: 'R U R\' U\' R\' F R2 U\' R\' U\' R U R\' F\'',
    difficulty: 1,
    tags: ['棱块'],
  },
];

export const allCases = [...f2lCases, ...ollCases, ...pllCases];

export const getCasesByStep = (step: 'F2L' | 'OLL' | 'PLL'): CFOPCase[] => {
  switch (step) {
    case 'F2L': return f2lCases;
    case 'OLL': return ollCases;
    case 'PLL': return pllCases;
  }
};

export const getCaseById = (id: string): CFOPCase | undefined => {
  return allCases.find(c => c.id === id);
};
