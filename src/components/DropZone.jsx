import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const DropZone = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
      onFilesSelect(files);
    }
  };

  const handleChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (files.length > 0) {
      onFilesSelect(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 shadow-inner
        ${isDragging 
          ? 'border-accent-cyan bg-accent-cyan/10 scale-[1.02]' 
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'}`}
      aria-label="Strefa upuszczania pliku PDF"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && document.getElementById('file-input').click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      
      <div className={`p-6 rounded-full transition-transform duration-500 ${isDragging ? 'scale-110 bg-accent-cyan/20' : 'bg-slate-800 group-hover:scale-110 group-hover:bg-slate-700'}`}>
        {isDragging ? (
          <FileText className="w-12 h-12 text-accent-cyan animate-bounce" />
        ) : (
          <Upload className="w-12 h-12 text-slate-400 group-hover:text-accent-cyan" />
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xl font-medium text-slate-100">
          Przeciągnij i upuść pliki PDF
        </p>
        <p className="text-slate-400">
          lub kliknij aby wybrać dokumenty z dysku
        </p>
      </div>

      <p className="text-xs text-slate-500 mt-4 uppercase tracking-widest font-semibold">
        Brak limitu rozmiaru — obsługujemy duże pliki
      </p>

      {/* Overlay click handler */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => document.getElementById('file-input').click()} 
      />
    </div>
  );
};

export default DropZone;
