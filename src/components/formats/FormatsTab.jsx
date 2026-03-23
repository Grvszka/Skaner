import React, { useState, useMemo } from 'react';
import SummaryCards from '../SummaryCards';
import FormatChart from './FormatChart';
import ExportButtons from '../ExportButtons';
import FormatDetailsTable from './FormatDetailsTable';

const FormatsTab = ({ results }) => {
  const [selectedFile, setSelectedFile] = useState('all');

  const uniqueFiles = useMemo(() => {
    if (!results) return [];
    const files = new Set(results.map(r => r.fileName));
    return Array.from(files).filter(Boolean);
  }, [results]);

  const filteredResults = useMemo(() => {
    if (!results) return null;
    if (selectedFile === 'all') return results;
    return results.filter(r => r.fileName === selectedFile);
  }, [results, selectedFile]);

  if (!results) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 fade-in-0 slide-in-from-bottom-4" role="tabpanel" aria-label="Formaty">
      
      {uniqueFiles.length > 1 && (
        <div className="bg-blue-950/40 p-5 shrink-0 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          <label htmlFor="file-filter" className="text-blue-100 font-semibold text-lg flex-shrink-0 whitespace-nowrap">
            Widok wyników dla pliku:
          </label>
          <select 
            id="file-filter"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="bg-slate-950 border-2 border-blue-500/50 text-white font-bold text-base rounded-xl focus:ring-blue-400 focus:border-blue-400 block w-full p-3 transition-colors cursor-pointer shadow-inner flex-grow"
          >
            <option value="all">Wszystkie wgrane pliki (Podsumowanie)</option>
            {uniqueFiles.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>
      )}

      <SummaryCards results={filteredResults} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Podział wg formatu</h2>
          <FormatChart results={filteredResults} />
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-center items-center gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Eksport danych</h2>
          <ExportButtons results={filteredResults} />
        </div>
      </div>

      <FormatDetailsTable results={filteredResults} />
    </div>
  );
};

export default FormatsTab;
