import React from 'react';
import { FileStack, LayoutGrid, Maximize } from 'lucide-react';

const SummaryCard = ({ title, value, unit, icon: Icon, colorClass, highlight }) => (
  <div className={`border flex items-center transition-all duration-300 ${
    highlight 
      ? 'p-6 gap-6 rounded-2xl bg-slate-800/80 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-400/60 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]' 
      : 'p-4 gap-4 rounded-xl bg-slate-900/40 border-slate-800/50 hover:bg-slate-800/40 hover:scale-[1.01]'
  }`}>
    <div className={`border ${colorClass} ${
      highlight ? 'p-4 rounded-xl bg-slate-900 border-blue-500/30' : 'p-2.5 rounded-lg bg-slate-800/40 border-slate-700/50'
    }`}>
      <Icon className={highlight ? "w-8 h-8" : "w-5 h-5"} />
    </div>
    <div>
      <p className={`font-medium uppercase tracking-wider ${
        highlight ? 'text-sm text-blue-300' : 'text-[11px] text-slate-400'
      }`}>{title}</p>
      <p className={`font-bold text-slate-100 ${highlight ? 'text-4xl mt-1' : 'text-xl mt-0.5'} font-mono`}>
        {value} <span className={`font-normal font-sans ${highlight ? 'text-xl text-blue-400' : 'text-xs text-slate-500'}`}>{unit}</span>
      </p>
    </div>
  </div>
);

const SummaryCards = ({ results }) => {
  const totalPages = results.length;
  const uniqueFormats = new Set(results.map(r => r.name)).size;
  const totalArea = results.reduce((sum, r) => sum + r.area, 0).toFixed(4);

  const a4Pages = results.filter(r => r.area <= 0.065).length;
  const a3Pages = results.filter(r => r.area > 0.065 && r.area <= 0.13).length;
  const m2Area = results
    .filter(r => r.area > 0.13)
    .reduce((sum, r) => sum + r.area, 0)
    .toFixed(4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Łącznie stron" 
        value={totalPages} 
        unit="szt." 
        icon={FileStack}
        colorClass="text-accent-cyan"
      />
      <SummaryCard 
        title="Wykryte formaty" 
        value={uniqueFormats} 
        unit="typów" 
        icon={LayoutGrid}
        colorClass="text-accent-purple"
      />
      <SummaryCard 
        title="Łączna powierzchnia" 
        value={totalArea.replace('.', ',')} 
        unit="m²" 
        icon={Maximize}
        colorClass="text-accent-green"
      />
      <SummaryCard 
        title="A4" 
        value={a4Pages} 
        unit="str." 
        icon={FileStack}
        colorClass="text-accent-cyan"
        highlight={true}
      />
      <SummaryCard 
        title="A3" 
        value={a3Pages} 
        unit="str." 
        icon={LayoutGrid}
        colorClass="text-accent-purple"
        highlight={true}
      />
      <SummaryCard 
        title="m²" 
        value={m2Area.replace('.', ',')} 
        unit="m²" 
        icon={Maximize}
        colorClass="text-accent-green"
        highlight={true}
      />
    </div>
  );
};

export default SummaryCards;
