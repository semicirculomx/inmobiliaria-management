type ProgressBarProps = {
  percentage: number;
  title?: string;
};

export default function ProgressBar({ percentage, title }: ProgressBarProps) {
  // Asegurar que el porcentaje esté entre 0 y 100
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // Determinar color según el porcentaje
  const getColor = () => {
    if (safePercentage < 33) return 'from-red-500 to-red-600';
    if (safePercentage < 66) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  const getProgressColor = () => {
    if (safePercentage < 33) return 'bg-red-500';
    if (safePercentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full">
      {title && <p className="text-sm font-semibold text-gray-700 mb-2">{title}</p>}
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out`}
              style={{ width: `${safePercentage}%` }}
            />
          </div>
        </div>
        
        <div className="text-right min-w-12">
          <span className="text-lg font-bold text-gray-800">{safePercentage}%</span>
        </div>
      </div>
    </div>
  );
}
