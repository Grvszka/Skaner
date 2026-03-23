import React, { useState } from 'react';
import DropZone from './components/DropZone';
import ProgressBar from './components/ProgressBar';
import TabBar from './components/TabBar';
import FormatsTab from './components/formats/FormatsTab';
import BlanksTab from './components/blanks/BlanksTab';
import ColorsTab from './components/colors/ColorsTab';
import { analyzePdf } from './utils/pdfAnalyzer';
const App = () => {
  const [results, setResults] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('formats');

  const handleFilesSelect = async (files) => {
    if (!files || files.length === 0) {
      setError('Proszę wybrać poprawne pliki PDF.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    setFiles([]);
    setProgress({ current: 0, total: 0 });

    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      setInfo('Duża ilość danych — ładowanie może potrwać dłużej.');
    } else {
      setInfo(null);
    }
    setProgress({ current: 0, total: 0 });

    try {
      let combinedResults = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (files.length > 1) {
          setInfo(`Analizowanie pliku ${i + 1} z ${files.length}: ${file.name}`);
        }
        
        const fileResults = await analyzePdf(file, (current, total) => {
          setProgress({ current, total });
        });
        
        combinedResults = [...combinedResults, ...fileResults];
      }
      setResults(combinedResults);
      setFiles(files);
    } catch (err) {
      console.error(err);
      setError('Wystąpił błąd podczas analizy plików PDF.');
    } finally {
      setIsAnalyzing(false);
      if (files.length > 1) {
        setInfo(null);
      }
    }
  };

  const handleReset = () => {
    setResults(null);
    setFiles([]);
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
            <DropZone onFilesSelect={handleFilesSelect} />
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
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'formats' && <FormatsTab results={results} />}
            {activeTab === 'blanks' && <BlanksTab files={files} />}
            {activeTab === 'colors' && <ColorsTab files={files} />}
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
