import { useParams, Navigate } from 'react-router-dom';
import { CaseCard } from '../components/CaseCard';
import { getCasesByStep } from '../data/cases';
import { getStepFromPath } from '../store';
import type { CFOPStep } from '../types';
import { STEP_INFO } from '../types';

export function CaseList() {
  const { step } = useParams<{ step: string }>();
  
  if (!step) {
    return <Navigate to="/" replace />;
  }
  
  const stepInfo = getStepFromPath(step);
  
  if (!stepInfo) {
    return <Navigate to="/" replace />;
  }
  
  const cases = getCasesByStep(stepInfo as CFOPStep);
  const info = STEP_INFO[stepInfo as CFOPStep];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{info.step}</h1>
          <p className="text-gray-600">{info.name}</p>
        </div>
        <span className="text-sm text-gray-500">{cases.length} / {info.caseCount} 种</span>
      </div>
      
      <div className="space-y-3">
        {cases.map(caseItem => (
          <CaseCard key={caseItem.id} caseItem={caseItem} />
        ))}
      </div>
      
      {cases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p>暂无数据</p>
        </div>
      )}
    </div>
  );
}
