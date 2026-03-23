import React, { useState, useMemo } from 'react';
import { Play, Download, Palette, FileStack, Droplet } from 'lucide-react';
import { useColorsAnalysis } from '../../hooks/useColorsAnalysis';
import ColorDetailsTable from './ColorDetailsTable';
import ColorChart from './ColorChart';
import ProgressBar from '../ProgressBar';
import { exportColorsCsv } from '../../utils/csvExport';

const ColorsTab = ({ files }) => {
  const { isAnalyzing, progress, results, startAnalysis } = useColorsAnalysis(files);
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

  const handleExport = () => {
    if (filteredResults) {
      exportColorsCsv(filteredResults);
    }
  };

  if (!results && !isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900 rounded-2xl border border-slate-800 text-center animate-in fade-in duration-500">
        <Palette className="w-16 h-16 text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Rozpoznawanie Kolorów</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Przeanalizuję każdą stronę pod kątem nasycenia jej układu barwnego. Rozdzielę dokument na części kolorowe i te wydrukowane bez koloru.
        </p>
        <button
          onClick={startAnalysis}
          className="flex items-center justify-center gap-3 px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xl tracking-wide rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] border-2 border-purple-400/50"
        >
          <Play className="w-5 h-5 fill-current" />
          Rozpocznij skanowanie barw ({files.length} plików)
        </button>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto mt-12 space-y-4">
        <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl text-center">
           <Palette className="w-10 h-10 text-slate-600 mb-4 mx-auto animate-pulse" />
           <p className="text-slate-400 mb-6 font-mono text-sm">{progress.text}</p>
           <ProgressBar current={progress.current} total={progress.total} />
        </div>
      </div>
    );
  }

  const totalPages = filteredResults.length;
  const colorPages = filteredResults.filter(r => r.isColor).length;
  const bwPages = totalPages - colorPages;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 fade-in-0 slide-in-from-bottom-4" role="tabpanel" aria-label="Kolory">
      {uniqueFiles.length > 1 && (
        <div className="bg-blue-950/40 p-5 shrink-0 rounded-2xl border-2 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
          <label htmlFor="file-filter-colors" className="text-blue-100 font-semibold text-lg flex-shrink-0 whitespace-nowrap">
            Widok wyników dla pliku:
          </label>
          <select 
            id="file-filter-colors"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="bg-slate-950 border-2 border-blue-500/50 text-white font-bold text-base rounded-xl focus:ring-blue-400 focus:border-blue-400 block w-full p-3 transition-colors cursor-pointer shadow-inner flex-grow"
          >
            <option value="all">Wszystkie dokumenty (Zusammen)</option>
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
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Zsumowane strony</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{totalPages}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <Palette className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Kolorowe</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{colorPages}</p>
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6 transition-transform hover:scale-[1.02]">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
            <Droplet className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Czarno-białe / Skala 256</p>
            <p className="text-3xl font-bold text-slate-100 mt-1 font-mono">{bwPages}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Proporcje kolorów w dokumencie</h2>
          <ColorChart results={filteredResults} />
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-center items-center gap-6">
          <h2 className="text-xl font-semibold text-slate-200">Zapisanie logów skanowania</h2>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] group border border-purple-400/50 w-full max-w-md text-lg"
          >
            <Download className="w-6 h-6 text-purple-100 group-hover:scale-110 transition-transform" />
            <span>Pobierz arkusz .CSV</span>
          </button>
        </div>
      </div>

      <ColorDetailsTable results={filteredResults} />
    </div>
  );
};

export default ColorsTab;
