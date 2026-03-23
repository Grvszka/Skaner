import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { exportDetailedCsv, exportSummaryCsv } from '../utils/csvExport';

const ExportButtons = ({ results }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={() => exportSummaryCsv(results)}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all group hover:border-accent-purple"
      >
        <FileSpreadsheet className="w-5 h-5 text-accent-purple group-hover:scale-110 transition-transform" />
        <span className="font-medium">Eksportuj podsumowanie</span>
      </button>

      <button
        onClick={() => exportDetailedCsv(results)}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all group hover:border-accent-cyan"
      >
        <Download className="w-5 h-5 text-accent-cyan group-hover:scale-110 transition-transform" />
        <span className="font-medium">Eksportuj pełną listę</span>
      </button>
    </div>
  );
};

export default ExportButtons;
