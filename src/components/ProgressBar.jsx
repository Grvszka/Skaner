import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full space-y-4" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
      <div className="flex justify-between items-end mb-2">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-slate-100">Analizowanie pliku...</h3>
          <p className="text-sm text-slate-400">
            Przetworzono stronę <span className="text-accent-cyan font-mono">{current}</span> z <span className="font-mono">{total}</span>
          </p>
        </div>
        <span className="text-2xl font-bold text-accent-cyan font-mono leading-none">
          {percentage}%
        </span>
      </div>

      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-center">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold animate-pulse">
            System analizuje wymiary stron
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;
