import { Link } from 'react-router-dom';
import { STEP_INFO } from '../types';
import type { CFOPStep } from '../types';

const stepColors: Record<CFOPStep, { bg: string; text: string; border: string }> = {
  F2L: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' },
  OLL: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-600' },
  PLL: { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600' },
};

interface StepCardProps {
  step: CFOPStep;
}

export function StepCard({ step }: StepCardProps) {
  const info = STEP_INFO[step];
  const colors = stepColors[step];

  return (
    <Link
      to={`/${info.step.toLowerCase()}`}
      className={`block p-6 rounded-2xl ${colors.bg} ${colors.text} shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
    >
      <div className="text-3xl font-bold mb-2">{info.step}</div>
      <div className="text-lg opacity-90 mb-1">{info.name}</div>
      <div className="text-sm opacity-75 mb-4">{info.description}</div>
      <div className={`inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium`}>
        {info.caseCount} 种形态
      </div>
    </Link>
  );
}
