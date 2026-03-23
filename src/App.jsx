import React, { useState } from 'react';
import DropZone from './components/DropZone';
import ProgressBar from './components/ProgressBar';
import SummaryCards from './components/SummaryCards';
import FormatChart from './components/FormatChart';
import PageDetailsTable from './components/PageDetailsTable';
import ExportButtons from './components/ExportButtons';
import { analyzePdf } from './utils/pdfAnalyzer';

const App = () => {
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const handleFileSelect = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Proszę wybrać poprawny plik PDF.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setProgress({ current: 0, total: 0 });

    if (file.size > 200 * 1024 * 1024) {
      setInfo('Duży plik — ładowanie może potrwać do minuty.');
    } else {
      setInfo(null);
    }
    setProgress({ current: 0, total: 0 });

    try {
      const analysisResults = await analyzePdf(file, (current, total) => {
        setProgress({ current, total });
      });
      setResults(analysisResults);
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd podczas analizy pliku PDF.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setProgress({ current: 0, total: 0 });
    setError(null);
    setInfo(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent-cyan tracking-tight">PDF Page Scanner</h1>
          <p className="text-slate-400 mt-1">Analiza formatów i powierzchni dokumentów PDF</p>
        </div>
        {results && (
          <button 
            onClick={handleReset}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            aria-label="Wczytaj nowy plik"
          >
            Nowy plik
          </button>
        )}
      </header>

      <main className="space-y-8">
        {!results && !isAnalyzing && (
          <div className="max-w-xl mx-auto mt-20">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}
            <DropZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {isAnalyzing && (
          <div className="max-w-2xl mx-auto mt-20 space-y-4">
            {info && (
              <div className="p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg text-blue-200 text-sm text-center">
                {info}
              </div>
            )}
            <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
               <ProgressBar current={progress.current} total={progress.total} />
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <SummaryCards results={results} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-slate-200">Podział wg formatu</h2>
                <FormatChart results={results} />
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-center items-center gap-6">
                <h2 className="text-xl font-semibold text-slate-200">Eksport danych</h2>
                <ExportButtons results={results} />
              </div>
            </div>

            <PageDetailsTable results={results} />
          </div>
        )}
      </main>
      
      <footer className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} &bull; Narzędzie wewnętrzne &bull; PDF Page Scanner
      </footer>
    </div>
  );
};

export default App;
