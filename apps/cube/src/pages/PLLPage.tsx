import { Link } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { RubikImage } from '../components/RubikImage';

export function PLLPage() {
  const { cases } = useCase();
  const pllCases = cases.filter(c => c.id.startsWith('pll-'));

  return (
    <div className="p-4 pb-12">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
        {pllCases.map((c) => (
          <Link 
            key={c.id} 
            to={`/pll/${c.id}`}
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all overflow-hidden active:scale-95"
          >
            <div className="aspect-square p-1 sm:p-2 bg-gray-50/50 flex items-center justify-center">
              <RubikImage 
                src={c.imgSrc} 
                alt={c.name}
                spin={c.formulas.find(f => f.id === c.mainFormulaId)?.spin || c.formulas[0]?.spin || 0}
                className="w-full h-full object-contain pointer-events-none mix-blend-multiply"
              />
            </div>
            <div className="py-2.5 text-center text-sm font-semibold text-gray-700 bg-white border-t border-gray-50">
              {c.alias || c.name.replace(/PLL /i, '')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
