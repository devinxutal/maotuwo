import { CubeCase, Formula } from '../data/types';

export interface BackupData {
  version: number;
  timestamp: string;
  data: Record<string, {
    mainFormulaId: string | null;
    formulas: Formula[];
  }>;
}

export const exportBackup = (cases: CubeCase[]) => {
  const exportData: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    data: {}
  };

  cases.forEach(c => {
    exportData.data[c.id] = {
      mainFormulaId: c.mainFormulaId,
      formulas: c.formulas
    };
  });

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `cube_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const parseBackup = (jsonStr: string, currentCases: CubeCase[]): CubeCase[] | null => {
  try {
    const parsed = JSON.parse(jsonStr) as BackupData;
    if (!parsed || parsed.version !== 1 || !parsed.data) {
      throw new Error("Invalid backup format");
    }

    const newCases = currentCases.map(c => {
      const backupCase = parsed.data[c.id];
      if (backupCase) {
        return {
          ...c,
          mainFormulaId: backupCase.mainFormulaId,
          formulas: backupCase.formulas
        };
      }
      return c;
    });

    return newCases;
  } catch (error) {
    console.error("Backup parsing error", error);
    return null;
  }
};
