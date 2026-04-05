import React, { useRef, useState } from 'react';
import { useCase } from '../context/CaseContext';
import { exportBackup } from '../utils/backup';
import defaultFormulasConfig from '../data/default_formulas.json';
import { ProfileData } from '../utils/api';

const PROFILE_EMOJIS: Record<string, string> = {
  public: '🌐',
  loki: '🐺',
  gloria: '🌸',
  eric: '🎸',
  sunny: '☀️'
};

const PROFILES = ['public', 'loki', 'gloria', 'eric', 'sunny'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupModal({ isOpen, onClose }: Props) {
  const { cases, activeProfile, setActiveProfile, saveFullProfile, syncStatus } = useCase();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          const parsed = JSON.parse(result);
          if (!parsed || !parsed.data) {
            setMsg('无效的备份文件格式！');
            return;
          }
          // Save to cloud and refresh local state
          await saveFullProfile(parsed as ProfileData);
          setMsg('导入成功！已同步至云端。');
        } catch {
          setMsg('JSON 解析失败！请检查文件格式。');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToDefaults = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setMsg('请再次点击确认还原默认配置（将清除所有自定义内容）');
      setTimeout(() => { setConfirmReset(false); setMsg(''); }, 4000);
      return;
    }
    const defaultData = defaultFormulasConfig as ProfileData;
    await saveFullProfile({ ...defaultData, timestamp: new Date().toISOString() });
    setConfirmReset(false);
    setMsg('已成功还原至默认配置！');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col transform transition-all">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">配置中心</h3>
          <div className="flex items-center gap-2">
            {syncStatus === 'syncing' && (
              <span className="text-xs text-blue-500 font-bold animate-pulse">同步中...</span>
            )}
            {syncStatus === 'error' && (
              <span className="text-xs text-red-500 font-bold">同步失败</span>
            )}
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col space-y-4 relative">
          {/* Profile Selector */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Profile 配置档案</div>
            <div className="flex gap-2">
              {PROFILES.map(p => (
                <button
                  key={p}
                  onClick={() => { setActiveProfile(p); setMsg(`已切换至 ${p}`); setTimeout(() => setMsg(''), 2000); }}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    activeProfile === p
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-lg leading-none">{PROFILE_EMOJIS[p] || '👤'}</span>
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {msg && (
            <div className={`text-sm px-3 py-2 rounded font-medium ${msg.includes('成功') || msg.includes('切换') ? 'bg-green-50 text-green-700' : msg.includes('确认') ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
              {msg}
            </div>
          )}

          <button 
            onClick={handleExport}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-sm active:scale-[0.98] active:bg-blue-700 transition-all flex justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
            导出当前 Profile
          </button>
          
          <button 
            onClick={handleImportClick}
            className="w-full py-3.5 bg-gray-50 text-gray-700 rounded-xl font-bold border border-gray-200 active:scale-[0.98] active:bg-gray-100 transition-all flex justify-center items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            导入 JSON 覆盖云端
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
