import { StepCard } from '../components/StepCard';
import type { CFOPStep } from '../types';

const steps: CFOPStep[] = ['F2L', 'OLL', 'PLL'];

export function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CFOP Expert</h1>
        <p className="text-gray-600">学习三阶魔方 CFOP 方法</p>
      </div>
      
      <div className="space-y-4">
        {steps.map(step => (
          <StepCard key={step} step={step} />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-primary-50 rounded-xl">
        <h2 className="font-semibold text-primary-800 mb-2">关于 CFOP</h2>
        <p className="text-sm text-primary-700">
          CFOP 是目前最流行的速解魔方方法，包含四个步骤：
          Cross（十字）、F2L（前三层）、OLL（顶层翻色）、PLL（顶层换位）。
          本应用专注于 F2L、OLL、PLL 三个步骤的 119 种标准形态。
        </p>
      </div>
    </div>
  );
}
