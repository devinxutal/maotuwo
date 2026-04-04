import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CaseProvider } from './context/CaseContext';
import { F2LPage } from './pages/F2LPage';
import { FormulaDetailPage } from './pages/FormulaDetailPage';
import { OLLPage } from './pages/OLLPage';
import { PLLPage } from './pages/PLLPage';
import { BackupModal } from './components/BackupModal';

function Header() {
  const location = useLocation();
  const currentPhase = location.pathname.split('/')[1];
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  return (
    <>
    <header className="bg-white shadow-sm relative z-10 border-b border-gray-100">
      <div className="h-14 grid grid-cols-[3.5rem_1fr_3.5rem] items-center px-2 sm:px-4">
        <div className="flex items-center justify-start">
          <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full active:bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
        </div>
        <div className="flex justify-center items-center min-w-0">
          <div className="flex bg-gray-100 p-1 rounded-lg max-w-full overflow-hidden">
            {['f2l', 'oll', 'pll'].map(phase => (
              <Link 
                key={phase}
                to={`/${phase}`}
                className={`px-3 sm:px-4 py-1 text-sm font-bold rounded-md transition-all ${currentPhase === phase ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {phase.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end">
           <button onClick={() => setIsBackupOpen(true)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition-all rounded-full flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
           </button>
        </div>
      </div>
    </header>
    <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
}

function Home() {
  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      <Link to="/f2l" className="flex-1 flex flex-col bg-blue-500 rounded-2xl shadow-sm items-center justify-center active:scale-[0.98] transition-transform select-none">
        <span className="text-5xl font-black text-white mb-2 drop-shadow-md">F2L</span>
        <span className="text-blue-100 font-medium">First 2 Layers</span>
      </Link>
      <Link to="/oll" className="flex-1 flex flex-col bg-orange-500 rounded-2xl shadow-sm items-center justify-center active:scale-[0.98] transition-transform select-none">
        <span className="text-5xl font-black text-white mb-2 drop-shadow-md">OLL</span>
        <span className="text-orange-100 font-medium">Orientation</span>
      </Link>
      <Link to="/pll" className="flex-1 flex flex-col bg-emerald-500 rounded-2xl shadow-sm items-center justify-center active:scale-[0.98] transition-transform select-none">
        <span className="text-5xl font-black text-white mb-2 drop-shadow-md">PLL</span>
        <span className="text-emerald-100 font-medium">Permutation</span>
      </Link>
    </div>
  );
}



function App() {
  return (
    <CaseProvider>
      <BrowserRouter>
        {/* 桌面端呈现居中手机壳，移动端直接撑满 */}
        <div className="min-h-screen flex justify-center bg-gray-200 md:py-8">
          <div className="w-full max-w-md bg-gray-50 min-h-screen md:min-h-0 md:h-[850px] md:rounded-[2.5rem] flex flex-col relative shadow-2xl overflow-hidden md:border-[8px] border-gray-800">
            <Header />
            <main className="flex-1 flex flex-col overflow-y-auto overscroll-y-contain pb-safe relative">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/f2l" element={<F2LPage />} />
                <Route path="/:phase/:id" element={<FormulaDetailPage />} />
                <Route path="/oll" element={<OLLPage />} />
                <Route path="/pll" element={<PLLPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </CaseProvider>
  );
}

export default App;
