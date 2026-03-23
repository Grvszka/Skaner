import { useState, useCallback } from 'react';
import { renderPageToCanvas } from '../utils/pageRenderer';
import { identifyPageColor } from '../utils/colorDetector';

export const useColorsAnalysis = (files) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, text: '' });
  const [results, setResults] = useState(null);

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
            text: `Badanie pikseli barwnych na stronie ${i} z ${numPages} (Plik ${fIndex + 1}/${files.length})`
          });
          
          // Używamy szerokości domyślnej 200 by wykorzystać potencjalny cache z modułu Puste strony
          const imageData = await renderPageToCanvas(file, i, 200);
          const { isColor, colorSaturation } = identifyPageColor(imageData, 30, 3);
          
          allResults.push({
            pageNumber: i,
            fileName: file.name,
            fileIndex: fIndex,
            isColor,
            saturation: colorSaturation
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
  }, [files]);

  return { isAnalyzing, progress, results, startAnalysis };
};
