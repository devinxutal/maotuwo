import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { Formula, CubeCase } from '../data/types';
import { RubikImage } from '../components/RubikImage';
import { normalizeFormula } from '../utils/formulaUtils';
import { ORDERED_OLL_IDS, ORDERED_PLL_IDS } from '../data/groups';

export function FormulaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cases, getCase, updateCase } = useCase();
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormulaId, setActiveFormulaId] = useState<string | null>(null);
  const [formulaErrors, setFormulaErrors] = useState<Record<string, string | null>>({});

  const currentCase = getCase(id || '');

  const renderFormula = (text?: string, alignCls: string = "justify-center") => {
    if (!text) return <span className="text-gray-400">(空)</span>;
    return (
      <div className={`flex flex-wrap items-center ${alignCls}`}>
        {text.split(/(\s+|\(|\))/).filter(t => t.trim() || t === '(' || t === ')').map((token, idx) => {
          if (token === '(' || token === ')') {
            return <span key={idx} className="text-gray-300 font-light mx-0.5">{token}</span>;
          }
          if (token.includes("'")) {
             return <span key={idx} className="text-rose-700 font-bold ml-1 tracking-wide">{token}</span>;
          }
          return <span key={idx} className="text-emerald-700 font-bold ml-1 tracking-wide">{token}</span>;
        })}
      </div>
    );
  };
  
  if (!currentCase) {
    return <div className="p-4 flex flex-col items-center mt-10">
      <div className="text-xl text-gray-500 mb-4">找不到对此形态的配置</div>
      <button onClick={() => navigate('/f2l')} className="text-blue-500 underline">返回列表</button>
    </div>;
  }

  const handleUpdateFormulas = (newFormulas: Formula[]) => {
    updateCase(currentCase.id, { formulas: newFormulas });
  };

  const setMainFormula = (fid: string) => {
    updateCase(currentCase.id, { mainFormulaId: fid });
  };

  const addFormula = () => {
    const newFormula: Formula = { id: Date.now().toString(), expression: '', tag: '主公式' };
    handleUpdateFormulas([...(currentCase.formulas || []), newFormula]);
    if (!currentCase.mainFormulaId) setMainFormula(newFormula.id);
  };

  const removeFormula = (fid: string) => {
    const nextFormulas = currentCase.formulas.filter(f => f.id !== fid);
    handleUpdateFormulas(nextFormulas);
    if (activeFormulaId === fid) setActiveFormulaId(null);
    if (currentCase.mainFormulaId === fid) {
      updateCase(currentCase.id, { mainFormulaId: nextFormulas[0]?.id || null });
    }
  };

  const updateFormulaText = (fid: string, expression: string) => {
    handleUpdateFormulas(currentCase.formulas.map(f => f.id === fid ? {...f, expression} : f));
  };

  const handleFormulaBlur = (fid: string, raw: string) => {
    const { normalized, error } = normalizeFormula(raw);
    if (normalized !== raw) {
      updateFormulaText(fid, normalized);
    }
    setFormulaErrors(prev => ({ ...prev, [fid]: error }));
  };
  const updateFormulaTag = (fid: string, tag: string) => {
    handleUpdateFormulas(currentCase.formulas.map(f => f.id === fid ? {...f, tag} : f));
  };
  const updateFormulaSpin = (fid: string, spin: number) => {
    handleUpdateFormulas(currentCase.formulas.map(f => f.id === fid ? {...f, spin} : f));
  };

  const displayFormulaId = activeFormulaId || currentCase.mainFormulaId || currentCase.formulas?.[0]?.id;
  const displayFormula = currentCase.formulas?.find(f => f.id === displayFormulaId);
  const alternatives = currentCase.formulas?.filter(f => f.id !== displayFormulaId) || [];

  const phasePath = currentCase.id.split('-')[0];
  let phaseCases: CubeCase[] = [];
  if (phasePath === 'oll') {
    phaseCases = ORDERED_OLL_IDS.map(id => cases.find(c => c.id === id)).filter(Boolean) as CubeCase[];
  } else if (phasePath === 'pll') {
    phaseCases = ORDERED_PLL_IDS.map(id => cases.find(c => c.id === id)).filter(Boolean) as CubeCase[];
  } else {
    phaseCases = cases.filter(c => c.id.split('-')[0] === phasePath);
  }

  const displayTitle = phasePath === 'pll' ? `${currentCase.alias} Perm` : currentCase.name;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative pb-28">
      {/* Detail Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shadow-sm relative z-20 bg-white">
        <button onClick={() => navigate(`/${phasePath}`)} className="text-gray-500 hover:text-gray-800 p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h2 className="font-extrabold text-xl text-gray-800 tracking-wide px-1">{displayTitle}</h2>
        <button onClick={() => setIsEditing(!isEditing)} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isEditing ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {isEditing ? '完成' : '编辑'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 mt-1">
        {/* Top: Image (Hidden in Edit Mode) */}
        {!isEditing && (
          <div className="flex justify-center mb-10">
             <div className="relative">
               <RubikImage 
                 src={currentCase.imgSrc} 
                 alt={currentCase.name} 
                 spin={phasePath === 'f2l' ? 0 : (displayFormula?.spin || 0)}
                 className="w-48 h-48 mix-blend-multiply drop-shadow-sm" 
               />
             </div>
          </div>
        )}

        {/* View Mode */}
        {!isEditing && (
          <div className="flex flex-col gap-6">
             {/* Main Formula */}
             <div className="text-center px-2">
                 <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                     {activeFormulaId && activeFormulaId !== currentCase.mainFormulaId ? "Highlight Formula" : "Main Formula"}
                 </div>
                 {/* Main Formula Text */}
                 <div className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide min-h-[60px] flex items-center justify-center text-center px-4 leading-relaxed">
                     {displayFormula ? renderFormula(displayFormula.expression, "justify-center") : '暂无公式'}
                 </div>
                 {displayFormula && displayFormula.tag && (
                     <span className="inline-block mt-4 px-3 py-1 border border-gray-200 text-gray-600 bg-gray-50 rounded-full text-xs font-bold">
                         {displayFormula.tag}
                     </span>
                 )}
             </div>

             {/* Alternatives */}
             {alternatives.length > 0 && (
               <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="text-gray-400 font-bold mb-4 text-xs tracking-wider uppercase pl-1">备用公式 Alternatives</h3>
                  <div className="flex flex-col gap-3">
                    {alternatives.map(f => (
                      <div 
                        key={f.id} 
                        onClick={() => setActiveFormulaId(f.id)}
                        className="p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer select-none transition-all flex flex-col justify-center active:scale-[0.98]"
                      >
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <RubikImage src={currentCase.imgSrc} spin={phasePath === 'f2l' ? 0 : (f.spin || 0)} className="w-8 h-8 mix-blend-multiply flex-shrink-0" />
                               <div className="font-extrabold text-xl text-gray-800 tracking-wide">{renderFormula(f.expression, "justify-start")}</div>
                             </div>
                             <div className="flex items-center gap-2 shrink-0 ml-2">
                                {f.tag && <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{f.tag}</span>}
                             </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="flex flex-col gap-5 pb-6 mt-2">
             <div className="text-sm font-bold text-gray-500 mb-1 px-1">编辑您的公式库 ({currentCase.formulas.length})</div>
             {currentCase.formulas?.map((f) => (
                <div key={f.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative shadow-sm transition-all focus-within:border-blue-300 focus-within:shadow-md">
                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/70">
                      <div className="flex items-center gap-4">
                         <div className="relative group">
                            <RubikImage src={currentCase.imgSrc} spin={phasePath === 'f2l' ? 0 : (f.spin || 0)} className="w-[4.5rem] h-[4.5rem] drop-shadow-sm mix-blend-multiply" />
                            {phasePath !== 'f2l' && (
                              <button 
                                onClick={() => updateFormulaSpin(f.id, ((f.spin || 0) + 90) % 360)}
                                className="absolute -right-2 top-0 flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all shadow-md active:scale-95"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                              </button>
                            )}
                         </div>
                         {phasePath !== 'f2l' && (
                           <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">当前旋转</span>
                              <span className="font-extrabold text-xl text-blue-600">{f.spin || 0}°</span>
                           </div>
                         )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2.5">
                         <button onClick={() => removeFormula(f.id)} className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 bg-red-50 rounded-md active:scale-95">
                            删除
                         </button>
                         <label className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 cursor-pointer select-none bg-white px-2 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 active:scale-95">
                            <input 
                               type="radio" 
                               checked={currentCase.mainFormulaId === f.id} 
                               onChange={() => setMainFormula(f.id)} 
                               className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                            />
                            <span>主展示</span>
                         </label>
                      </div>
                   </div>
                  <input 
                     type="text" 
                     placeholder="填入魔方公式 (如: R U R' U')" 
                     value={f.expression} 
                     onChange={e => updateFormulaText(f.id, e.target.value)} 
                     onBlur={e => handleFormulaBlur(f.id, e.target.value)}
                     className={`w-full p-3 font-mono font-bold text-lg bg-white border rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${formulaErrors[f.id] ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {formulaErrors[f.id] && (
                    <div className="text-xs text-red-500 font-medium mb-2 px-1">
                      ⚠️ {formulaErrors[f.id]}
                    </div>
                  )}
                  <input 
                     type="text" 
                     placeholder="备注特征/手法 (如 左手公式, 背后插入)" 
                     value={f.tag} 
                     onChange={e => updateFormulaTag(f.id, e.target.value)} 
                     className="w-full p-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
             ))}
             <button onClick={addFormula} className="py-4 border-2 border-dashed border-gray-300 bg-gray-50/50 rounded-xl text-gray-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mt-2">
                + 新增一条备选
             </button>
          </div>
        )}
      </div>

      {/* Bottom Carousel Navigation */}
      <div className="custom-scrollbar absolute bottom-0 left-0 right-0 h-[96px] bg-gray-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] border-t border-gray-200 flex overflow-x-auto flex-nowrap items-center px-4 gap-3 z-30 pb-1" style={{WebkitOverflowScrolling: 'touch'}}>
         {phaseCases.map(c => {
            const phasePath = c.id.split('-')[0];
            return (
            <Link 
              key={c.id} 
              to={`/${phasePath}/${c.id}`}
              replace={true}
              onClick={() => {
                 setActiveFormulaId(null);
                 setIsEditing(false);
              }}
              className={`flex-shrink-0 w-[64px] h-[72px] rounded-xl bg-white border-2 flex flex-col items-center justify-center p-1 transition-all ${c.id === currentCase.id ? 'border-blue-500 shadow-md scale-105 bg-blue-50' : 'border-transparent shadow-sm hover:border-gray-200 opacity-80 hover:opacity-100'}`}
            >
              <div className="h-8 flex-1 flex items-center justify-center w-full">
                 <RubikImage 
                   src={c.imgSrc} 
                   alt={c.name} 
                   spin={phasePath === 'f2l' ? 0 : (c.formulas.find(f => f.id === c.mainFormulaId)?.spin || c.formulas[0]?.spin || 0)} 
                   className="max-h-full max-w-full object-contain mix-blend-multiply" 
                 />
              </div>
              <div className="text-[10px] font-bold text-gray-500 mt-1 truncate w-full text-center leading-none">
                 {c.alias || c.name.replace(/F2L |OLL |PLL /i, '')}
              </div>
            </Link>
         )})}
      </div>
    </div>
  );
}
