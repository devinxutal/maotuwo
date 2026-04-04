import { CubeCase } from './types';

export const ollCases: CubeCase[] = Array.from({ length: 57 }, (_, i) => {
  const num = i + 1;
  
  return {
    id: `oll-${num}`,
    name: `OLL ${num}`,
    imgSrc: `/images/oll/${num}.png`,
    formulas: [],
    mainFormulaId: null
  };
});
