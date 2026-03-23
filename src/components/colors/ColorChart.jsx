import React from 'react';

const ColorChart = ({ results }) => {
  if (!results || results.length === 0) return null;

  const colorCount = results.filter(r => r.isColor).length;
  const bwCount = results.filter(r => !r.isColor).length;
  const total = results.length;

  const colorPercentage = (colorCount / total) * 100;
  const bwPercentage = (bwCount / total) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-end text-sm">
          <span className="font-bold text-slate-100">Kolorowe</span>
          <span className="text-slate-400 font-mono">
            {colorCount} {colorCount === 1 ? 'strona' : colorCount > 1 && colorCount < 5 ? 'strony' : 'stron'} 
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-purple rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            style={{ width: `${colorPercentage}%` }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-end text-sm">
          <span className="font-bold text-slate-100">Czarne i szare</span>
          <span className="text-slate-400 font-mono">
            {bwCount} {bwCount === 1 ? 'strona' : bwCount > 1 && bwCount < 5 ? 'strony' : 'stron'} 
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_5px_rgba(148,163,184,0.4)]"
            style={{ width: `${bwPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorChart;
