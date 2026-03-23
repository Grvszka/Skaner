import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { exportDetailedCsv, exportSummaryCsv } from '../utils/csvExport';

const ExportButtons = ({ results }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <button
        onClick={() => exportSummaryCsv(results)}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 group border border-purple-400/50"
      >
        <FileSpreadsheet className="w-5 h-5 text-purple-100 group-hover:scale-110 transition-transform" />
        <span>Eksportuj podsumowanie</span>
      </button>

      <button
        onClick={() => exportDetailedCsv(results)}
        className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/30 group border border-cyan-400/50"
      >
        <Download className="w-5 h-5 text-cyan-100 group-hover:scale-110 transition-transform" />
        <span>Eksportuj pełną listę</span>
      </button>
    </div>
  );
};

export default ExportButtons;
