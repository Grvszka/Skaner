import { classifyPage } from './pageClassifier';

/**
 * Sekwencyjna analiza stron pliku PDF
 * @param {File} file - Plik PDF z inputu
 * @param {Function} onProgress - Callback do aktualizacji postępu
 * @returns {Promise<Array>} - Tablica z wynikami dla każdej strony
 */
export const analyzePdf = async (file, onProgress) => {
  const arrayBuffer = await file.arrayBuffer();
  
  // pdfjsLib jest ładowany z CDN w index.html
  // @ts-ignore
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  
  // Konfiguracja worker-a (opcjonalna, ale zalecana)
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const results = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    
    const classification = classifyPage(viewport.width, viewport.height);
    
    results.push({
      pageNumber: i,
      ...classification
    });

    if (onProgress) {
      onProgress(i, numPages);
    }
    
    // Zwolnienie zasobów strony
    page.cleanup();
  }

  return results;
};
