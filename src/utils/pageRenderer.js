const renderCache = new Map();

/**
 * Renderuje stronę do canvasu i zwraca dane obrazu (ImageData)
 * Cache'uje wyniki, by nie renderować dwukrotnie przy przełączaniu modułów.
 * @param {File} file
 * @param {number} pageNumber
 * @param {number} targetWidth - szerokość docelowego canvas
 */
export const renderPageToCanvas = async (file, pageNumber, targetWidth = 100) => {
  const cacheKey = `${file.name}_${file.lastModified}_page_${pageNumber}_w${targetWidth}`;
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey);
  }

  const arrayBuffer = await file.arrayBuffer();
  // @ts-ignore
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  
  const viewport = page.getViewport({ scale: 1.0 });
  const maxDim = Math.max(viewport.width, viewport.height);
  const scale = targetWidth / maxDim;
  
  const scaledViewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: scaledViewport
  };

  await page.render(renderContext).promise;
  page.cleanup();
  
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  renderCache.set(cacheKey, imageData);
  
  return imageData;
};

export const clearRendererCache = () => {
  renderCache.clear();
};
