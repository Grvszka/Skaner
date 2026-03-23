import { useState, useCallback } from 'react';
import { renderPageToCanvas } from '../utils/pageRenderer';
import { isPageBlank } from '../utils/blankDetector';

export const useBlanksAnalysis = (files) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, text: '' });
  const [results, setResults] = useState(null);
  const [threshold, setThreshold] = useState(98);

  const startAnalysis = useCallback(async () => {
    if (!files || files.length === 0) return;
    
    setIsAnalyzing(true);
    setResults(null);
    const allResults = [];
    
    try {
      for (let fIndex = 0; fIndex < files.length; fIndex++) {
        const file = files[fIndex];
        
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        for (let i = 1; i <= numPages; i++) {
          setProgress({
            current: i,
            total: numPages,
            text: `Skupiam się na stronie ${i} z ${numPages} (Plik ${fIndex + 1}/${files.length})`
          });
          
          const imageData = await renderPageToCanvas(file, i, 100);
          const isBlank = isPageBlank(imageData, threshold);
          
          allResults.push({
            pageNumber: i,
            fileName: file.name,
            fileIndex: fIndex,
            fileRef: file,
            isBlank
          });
          
          await new Promise(r => setTimeout(r, 0));
        }
      }
      
      setResults(allResults);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
      setProgress({ current: 0, total: 0, text: '' });
    }
  }, [files, threshold]);

  return { isAnalyzing, progress, results, threshold, setThreshold, startAnalysis };
};
