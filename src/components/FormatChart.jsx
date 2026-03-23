import React from 'react';

const FormatChart = ({ results }) => {
  const summary = results.reduce((acc, r) => {
    if (!acc[r.name]) {
      acc[r.name] = { count: 0, area: 0 };
    }
    acc[r.name].count += 1;
    acc[r.name].area += r.area;
    return acc;
  }, {});

  const sortedFormats = Object.entries(summary)
    .sort((a, b) => b[1].count - a[1].count);

  const maxCount = Math.max(...sortedFormats.map(f => f[1].count));

  return (
    <div className="space-y-6">
      {sortedFormats.map(([name, stats]) => {
        const percentage = (stats.count / maxCount) * 100;
        
        return (
          <div key={name} className="space-y-2">
            <div className="flex justify-between items-end text-sm">
              <span className="font-bold text-slate-100">{name}</span>
              <span className="text-slate-400 font-mono">
                {stats.count} {stats.count === 1 ? 'strona' : stats.count < 5 ? 'strony' : 'stron'} 
                <span className="mx-2 text-slate-700">|</span> 
                {stats.area.toFixed(2).replace('.', ',')} m²
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-purple rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormatChart;
