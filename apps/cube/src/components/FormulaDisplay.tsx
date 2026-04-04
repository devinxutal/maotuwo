interface FormulaDisplayProps {
  formula: string;
  className?: string;
}

const notationColors: Record<string, string> = {
  'U': 'bg-blue-100 text-blue-700',
  'D': 'bg-green-100 text-green-700',
  'L': 'bg-orange-100 text-orange-700',
  'R': 'bg-red-100 text-red-700',
  'F': 'bg-purple-100 text-purple-700',
  'B': 'bg-cyan-100 text-cyan-700',
  "'": 'bg-gray-200 text-gray-600',
  '2': 'bg-gray-200 text-gray-600',
};

function NotationBadge({ notation }: { notation: string }) {
  let base = notation;
  let modifier = '';

  if (notation.endsWith("'")) {
    base = notation.slice(0, -1);
    modifier = "'";
  } else if (notation.endsWith('2')) {
    base = notation.slice(0, -1);
    modifier = '2';
  }

  const colorClass = notationColors[base] || 'bg-gray-100 text-gray-700';

  return (
    <span className="inline-flex items-baseline">
      <span className={`px-2 py-1 rounded font-bold text-sm ${colorClass}`}>
        {base}
      </span>
      {modifier && (
        <span className="text-lg font-bold text-gray-600 -ml-1">{modifier}</span>
      )}
    </span>
  );
}

export function FormulaDisplay({ formula, className = '' }: FormulaDisplayProps) {
  const parts = formula.trim().split(/\s+/);

  return (
    <div className={`flex flex-wrap gap-1 items-center ${className}`}>
      {parts.map((part, index) => (
        <span key={index} className="flex items-center gap-0.5">
          <NotationBadge notation={part} />
          {index < parts.length - 1 && (
            <span className="text-gray-400 mx-1">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
