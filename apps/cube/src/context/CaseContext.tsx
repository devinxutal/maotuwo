import React, { createContext, useContext, useEffect, useState } from 'react';
import { CubeCase } from '../data/types';
import { defaultF2LCases } from '../data/f2l';
import { ollCases } from '../data/oll';
import { pllCases } from '../data/pll';
import defaultFormulasConfig from '../data/default_formulas.json';

interface CaseContextValue {
  cases: CubeCase[];
  getCase: (id: string) => CubeCase | undefined;
  updateCase: (id: string, updatedCase: Partial<CubeCase>) => void;
  setCases: React.Dispatch<React.SetStateAction<CubeCase[]>>;
}

const CaseContext = createContext<CaseContextValue | undefined>(undefined);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CubeCase[]>(() => {
    const bareCases = [...defaultF2LCases, ...ollCases, ...pllCases];
    
    // Load decoupled factory generic config
    let factoryCases = bareCases;
    try {
      const configData = defaultFormulasConfig.data as Record<string, any>;
      if (configData) {
        factoryCases = bareCases.map(c => {
          const cd = configData[c.id];
          return cd ? { ...c, mainFormulaId: cd.mainFormulaId, formulas: cd.formulas } : c;
        });
      }
    } catch(e) {}

    // User LocalStorage layer loading (aligned strictly to Export Backup Schema)
    const stored = localStorage.getItem('cube_cases_v6'); // Bumped cache mapping
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.version === 1 && parsed.data) {
           return factoryCases.map(c => {
              const u = parsed.data[c.id];
              return u ? { ...c, mainFormulaId: u.mainFormulaId, formulas: u.formulas } : c;
           });
        }
      } catch (e) {}
    }
    return factoryCases;
  });

  useEffect(() => {
    const exportData = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {} as Record<string, any>
    };
    cases.forEach(c => {
       if (c.formulas && c.formulas.length > 0) {
          exportData.data[c.id] = { mainFormulaId: c.mainFormulaId, formulas: c.formulas };
       }
    });
    localStorage.setItem('cube_cases_v6', JSON.stringify(exportData));
  }, [cases]);

  const getCase = (id: string) => cases.find(c => c.id === id);

  const updateCase = (id: string, updatedCase: Partial<CubeCase>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, ...updatedCase } : c));
  };

  return (
    <CaseContext.Provider value={{ cases, getCase, updateCase, setCases }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCase must be used within CaseProvider');
  return ctx;
}
