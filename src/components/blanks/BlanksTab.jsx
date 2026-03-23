import React, { useState, useMemo } from 'react';
import { Play, Download, Settings2, FileStack, Droplets } from 'lucide-react';
import { useBlanksAnalysis } from '../../hooks/useBlanksAnalysis';
import BlankDetailsTable from './BlankDetailsTable';
import ProgressBar from '../ProgressBar';
import { downloadCleanPdf } from '../../utils/pdfCleaner';

const BlanksTab = ({ files }) => {
  const { isAnalyzing, progress, results, threshold, setThreshold, startAnalysis } = useBlanksAnalysis(files);
  const [selectedFile, setSelectedFile] = useState('all');

  const uniqueFiles = useMemo(() => {
    if (!results) return [];
    const _files = new Set(results.map(r => r.fileName));
    return Array.from(_files).filter(Boolean);
  }, [results]);

  const filteredResults = useMemo(() => {
    if (!results) return null;
    if (selectedFile === 'all') return results;
    return results.filter(r => r.fileName === selectedFile);
  }, [results, selectedFile]);

  const handleDownload = async () => {
    const fileGroups = uniqueFiles.map(fn => results.filter(r => r.fileName === fn));
    for (const group of fileGroups) {
      if (group.length === 0) continue;
      const file = group[0].fileRef;
      const blankPages = group.filter(r => r.isBlank).map(r => r.pageNumber);
      if (blankPages.length > 0) {
        await downloadCleanPdf(file, blankPages);
      } else {
        alert(`Plik ${file.name} nie ma pustych stron.`);
      }
    }
  };

  if (!results && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 rounded-2xl border border-slate-800 text-center animate-in fade-in duration-500">
        <Droplets className="w-16 h-16 text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Znajdź puste strony</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Przeanalizuję każdą stronę dokumentów pod kątem braku treści mapując miliony pikseli.
        </p>
        
        <div className="flex flex-col items-center gap-2 mb-8 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-inner w-full max-w-sm">
          <label htmlFor="threshold" className="text-sm font-semibold text-slate-300 flex justify-between w-full">
            <span>Tolerancja rozpoznania:</span>
            <span className="text-accent-cyan">{threshold}% jasności</span>
          </label>
          <input 
            id="threshold" 
            type="range" 
            min="90" max="100" step="0.1"
            value={threshold} 
            onChange={e => setThreshold(Number(e.target.value))} 
            className="w-full accent-accent-cyan cursor-grab active:cursor-grabbing"
          />
          <span className="text-xs text-slate-500 text-left w-full">Ustal ilu procentowy udział gładkiego tła uznajesz za ułomność. (Im bliżej 100% tym ciężej zaklasyfikować).</span>
        </div>

        <button
          onClick={startAnalysis}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-accent-cyan hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
        >
          <Play className="w-5 h-5 fill-current" />
          Rozpocznij mapowanie ({files.length} plików)
        </button>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto mt-12 space-y-4">
        <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl text-center">
           <Droplets className="w-10 h-10 text-slate-600 mb-4 mx-auto animate-pulse" />
           <p className="text-slate-400 mb-6 font-mono text-sm">{progress.text}</p>
           <ProgressBar current={progress.current} total={progress.total} />
        </div>
      </div>
    );
  }

  const totalPages = filteredResults.length;
  const blankPages = filteredResults.filter(r => r.isBlank).length;
  const contentPages = totalPages - blankPages;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 fade-in-0 slide-in-from-bottom-4" role="tabpanel" aria-label="Puste strony">
      
      {uniqueFiles.length > 1 && (
        <div className="bg-slate-900/50 p-4 shrink-0 rounded-xl border border-slate-800 flex flex-wrap items-center gap-4">
          <label htmlFor="file-filter-blanks" className="text-slate-400 font-medium">Filtruj zestaw:</label>
          <select 
            id="file-filter-blanks"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-accent-cyan focus:border-accent-cyan block w-full sm:max-w-xs p-2.5 transition-colors cursor-pointer"
          >
            <option value="all">Podsumowanie całkowite ({uniqueFiles.length} archiwów)</option>
            {uniqueFiles.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-accent-cyan">
            <FileStack className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Wszystkie strony</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{totalPages}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Pustostany</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{blankPages}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
            <Settings2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Z treścią</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{contentPages}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-6 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-green-400 font-bold rounded-xl transition-all shadow-lg border border-slate-700 hover:border-green-500/50 group w-full max-w-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={blankPages === 0}
        >
          <Download className={`w-6 h-6 ${blankPages === 0 ? '' : 'group-hover:scale-110 transition-transform'}`} />
          {blankPages === 0 ? 'Brak pustych stron' : 'Generuj i pobierz czysty plik'}
        </button>
        {blankPages > 0 && <p className="text-slate-500 text-sm mt-4 text-center">Uwaga: Jeśli wgrałeś wiele dokumentów, pobierane będą sekwencyjnie dla każdego z osobna.</p>}
      </div>

      <BlankDetailsTable results={filteredResults} />
    </div>
  );
};

export default BlanksTab;
