import React from 'react';
import { FileStack, LayoutGrid, Maximize } from 'lucide-react';

const SummaryCard = ({ title, value, unit, icon: Icon, colorClass }) => (
  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
    <div className={`p-4 rounded-xl bg-slate-800 border border-slate-700 ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">
        {value} <span className="text-lg font-normal text-slate-500 font-sans">{unit}</span>
      </p>
    </div>
  </div>
);

const SummaryCards = ({ results }) => {
  const totalPages = results.length;
  const uniqueFormats = new Set(results.map(r => r.name)).size;
  const totalArea = results.reduce((sum, r) => sum + r.area, 0).toFixed(4);

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
    </div>
  );
};

export default SummaryCards;
