import { Link } from 'react-router-dom';
import type { CFOPCase } from '../types';

interface CaseCardProps {
  caseItem: CFOPCase;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const difficultyStars = '★'.repeat(caseItem.difficulty) + '☆'.repeat(5 - caseItem.difficulty);

  return (
    <Link
      to={`/${caseItem.step.toLowerCase()}/${caseItem.id}`}
      className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:bg-gray-50"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium text-gray-500">{caseItem.id}</span>
          <h3 className="font-semibold text-gray-900">{caseItem.name}</h3>
        </div>
        <span className="text-amber-400 text-sm">{difficultyStars}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{caseItem.description}</p>
      
      <div className="font-mono text-sm bg-gray-100 rounded-lg px-3 py-2 text-gray-800">
        {caseItem.formula}
      </div>
      
      {caseItem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {caseItem.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
