import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const stepColors: Record<string, string> = {
  f2l: 'bg-blue-500',
  oll: 'bg-amber-500',
  pll: 'bg-emerald-500',
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const currentStep = pathParts[1] || '';
  const headerColor = stepColors[currentStep] || 'bg-primary-500';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className={`${headerColor} text-white px-4 py-3 shadow-lg sticky top-0 z-10`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <span className="font-bold text-lg">Cube Expert</span>
          </Link>
          <nav className="flex gap-2 text-sm">
            <Link to="/f2l" className={`px-3 py-1 rounded-full transition-colors ${currentStep === 'f2l' ? 'bg-white/30' : 'hover:bg-white/10'}`}>
              F2L
            </Link>
            <Link to="/oll" className={`px-3 py-1 rounded-full transition-colors ${currentStep === 'oll' ? 'bg-white/30' : 'hover:bg-white/10'}`}>
              OLL
            </Link>
            <Link to="/pll" className={`px-3 py-1 rounded-full transition-colors ${currentStep === 'pll' ? 'bg-white/30' : 'hover:bg-white/10'}`}>
              PLL
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>
      
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-200">
        <p>Cube Expert · 魔方学习助手</p>
      </footer>
    </div>
  );
}
