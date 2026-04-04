import { useParams, Navigate, Link } from 'react-router-dom';
import { FormulaDisplay } from '../components/FormulaDisplay';
import { getCaseById } from '../data/cases';
import { useCaseStore } from '../store';

export function CaseDetail() {
  const { step, id } = useParams<{ step: string; id: string }>();
  const { isFavorite, toggleFavorite } = useCaseStore();
  
  if (!id) {
    return <Navigate to="/" replace />;
  }
  
  const caseItem = getCaseById(id);
  
  if (!caseItem) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">❓</p>
        <p className="text-gray-600 mb-4">未找到该形态</p>
        <Link to="/" className="text-primary-500 hover:underline">返回首页</Link>
      </div>
    );
  }

  const favorited = isFavorite(id);
  const difficultyStars = '★'.repeat(caseItem.difficulty) + '☆'.repeat(5 - caseItem.difficulty);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link to={`/${step}`} className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← 返回列表
          </Link>
          <span className="text-xs font-medium text-gray-400 ml-2">{caseItem.id}</span>
          <h1 className="text-2xl font-bold text-gray-900">{caseItem.name}</h1>
          {caseItem.alias.length > 0 && (
            <p className="text-gray-500 text-sm">别名: {caseItem.alias.join(', ')}</p>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(id)}
          className={`text-2xl transition-transform active:scale-125 ${favorited ? 'text-red-500' : 'text-gray-300'}`}
        >
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-medium text-gray-500 mb-3">难度</h2>
        <p className="text-2xl text-amber-400 mb-4">{difficultyStars}</p>
        
        <h2 className="text-sm font-medium text-gray-500 mb-3">描述</h2>
        <p className="text-gray-700 mb-6">{caseItem.description}</p>
        
        <h2 className="text-sm font-medium text-gray-500 mb-3">公式</h2>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <FormulaDisplay formula={caseItem.formula} className="text-xl justify-center" />
        </div>
        
        {caseItem.tags.length > 0 && (
          <>
            <h2 className="text-sm font-medium text-gray-500 mb-3">标签</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {caseItem.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
        
        {caseItem.videoUrl && (
          <>
            <h2 className="text-sm font-medium text-gray-500 mb-3">视频教程</h2>
            <a
              href={caseItem.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-red-50 text-red-600 rounded-xl p-4 text-center hover:bg-red-100 transition-colors"
            >
              🎬 观看视频教程
            </a>
          </>
        )}
      </div>
    </div>
  );
}
