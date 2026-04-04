import { CubeCase } from './types';

export const defaultF2LCases: CubeCase[] = Array.from({ length: 41 }, (_, i) => {
  const num = i + 1;
  return {
    id: `f2l-${num}`,
    name: `F2L ${num}`,
    imgSrc: `/images/f2l/${num}.png`,
    formulas: [],
    mainFormulaId: null
  };
});
