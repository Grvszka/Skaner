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
        <div className="bg-slate-900/50 p-4 shrink-0 rounded-xl border border-slate-800 flex flex-wrap items-center gap-4">
          <label htmlFor="file-filter" className="text-slate-400 font-medium">Pokaż wyniki dla:</label>
          <select 
            id="file-filter"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-accent-cyan focus:border-accent-cyan block w-full sm:max-w-xs p-2.5 transition-colors cursor-pointer"
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
