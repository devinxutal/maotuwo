import React, { useRef, useState } from 'react';
import { useCase } from '../context/CaseContext';
import { exportBackup, parseBackup } from '../utils/backup';
import { defaultF2LCases } from '../data/f2l';
import { ollCases } from '../data/oll';
import { pllCases } from '../data/pll';
import defaultFormulasConfig from '../data/default_formulas.json';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: Props) {
  const { cases, setCases } = useCase();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackup(cases);
    setMsg('导出成功！已触发下载。');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const newCases = parseBackup(result, cases);
        if (newCases) {
          setCases(newCases);
          setMsg('还原成功啦！可随时关闭面板。');
        } else {
          setMsg('无效的备份文件或极度严重的格式错误！');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToDefaults = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setMsg('请再次点击确认还原默认配置（将清除所有自定义内容）');
      setTimeout(() => { setConfirmReset(false); setMsg(''); }, 4000);
      return;
    }
    const bareCases = [...defaultF2LCases, ...ollCases, ...pllCases];
    const configData = (defaultFormulasConfig as any).data as Record<string, any>;
    const resetCases = bareCases.map(c => {
      const cd = configData?.[c.id];
      return cd ? { ...c, mainFormulaId: cd.mainFormulaId, formulas: cd.formulas } : c;
    });
    setCases(resetCases);
    setConfirmReset(false);
    setMsg('已成功还原至默认配置！');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">配置备份还原中心</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 flex flex-col space-y-4 relative">
          <p className="text-[13px] text-gray-500 mb-2 leading-relaxed">
            安全地完整全量打包汇出您宝贵的包含自定义标签的所有魔方公式底座（JSON文件），亦或从其它设备同步覆盖导入进行无缝漫游！
          </p>
          
          {msg && (
            <div className={`text-sm px-3 py-2 rounded font-medium ${msg.includes('成功') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg}
            </div>
          )}

          <button 
            onClick={handleExport}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm active:scale-[0.98] active:bg-blue-700 transition-all flex justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            打包汇出至此设备
          </button>
          
          <button 
            onClick={handleImportClick}
            className="w-full py-3.5 bg-gray-50 text-gray-700 rounded-xl font-bold border border-gray-200 active:scale-[0.98] active:bg-gray-100 transition-all flex justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            选取外部 JSON 同步覆盖
          </button>

          <div className="border-t border-gray-100 pt-3">
            <button 
              onClick={handleResetToDefaults}
              className={`w-full py-3 rounded-xl font-bold active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-sm ${
                confirmReset 
                  ? 'bg-orange-500 text-white shadow-md animate-pulse' 
                  : 'bg-gray-50 text-gray-400 border border-gray-200 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              {confirmReset ? '再次确认——将清除所有自定义' : '还原默认配置'}
            </button>
          </div>

          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
