import { CubeCase } from './types';

const pllNames = ['Aa', 'Ab', 'E', 'F', 'Ga', 'Gb', 'Gc', 'Gd', 'H', 'Ja', 'Jb', 'Na', 'Nb', 'Ra', 'Rb', 'T', 'Ua', 'Ub', 'V', 'Y', 'Z'];

export const pllCases: CubeCase[] = pllNames.map((alias) => {
  const idStr = alias.toLowerCase();
  return {
    id: `pll-${idStr}`,
    name: `PLL ${alias}`,
    alias: alias,
    imgSrc: `/images/pll/${alias}.png`,
    formulas: [],
    mainFormulaId: null
  };
});
