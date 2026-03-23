import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

const PageDetailsTable = ({ results }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = results.slice(startIndex, endIndex);

  if (!isOpen) {
    return (
      <div className="flex justify-center py-8">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 transition-all font-medium"
        >
          <List className="w-5 h-5" />
          Pokaż szczegółową listę stron ({results.length})
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="text-xl font-semibold text-slate-100 italic">Szczegóły stron</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-200 text-sm font-medium"
        >
          Zwiń listę
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] tracking-[0.15em] font-bold">
            <tr>
              <th className="px-6 py-4 border-b border-slate-800">Nr strony</th>
              <th className="px-6 py-4 border-b border-slate-800">Format</th>
              <th className="px-6 py-4 border-b border-slate-800">Wymiary (mm)</th>
              <th className="px-6 py-4 border-b border-slate-800 text-center">Orientacja</th>
              <th className="px-6 py-4 border-b border-slate-800 text-right">Powierzchnia (m²)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {currentItems.map((page) => (
              <tr key={page.pageNumber} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-3 font-mono text-slate-400">{page.pageNumber}</td>
                <td className="px-6 py-3 font-semibold text-accent-cyan">{page.name}</td>
                <td className="px-6 py-3 text-slate-300 font-mono italic">
                  {page.widthMm} × {page.heightMm}
                </td>
                <td className="px-6 py-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    page.orientation === 'Poziomo' 
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' 
                      : 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {page.orientation}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-mono text-accent-green">
                  {page.area.toFixed(4).replace('.', ',')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/20">
          <p className="text-xs text-slate-500">
            Wyświetlono {startIndex + 1}–{Math.min(endIndex, results.length)} z {results.length} stron
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
              aria-label="Poprzednia strona"
            >
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </button>
            <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
              aria-label="Następna strona"
            >
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDetailsTable;
