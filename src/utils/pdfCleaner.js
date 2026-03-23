/**
 * Wczytuje wejściowy PDF, usuwa strony i generuje nowy do pobrania (pdf-lib)
 * @param {File} file 
 * @param {Array<number>} blankPages - tablica numerów uklad 1-indexed (np 1 oznacza pierwszą stronę)
 */
export const downloadCleanPdf = async (file, blankPages) => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Zakładamy pdf-lib ładowane z CDN w index.html
  // @ts-ignore
  const { PDFDocument } = window.PDFLib;
  
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // W pdf-lib indeksy zaczynają się od 0. Sortowanie malejące zapobiega uciekaniu indeksów w trakcie mapowania.
  const pagesToRemove = blankPages.map(p => p - 1).sort((a, b) => b - a);
  
  for (const pageIndex of pagesToRemove) {
    pdfDoc.removePage(pageIndex);
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  const originalName = file.name;
  const newName = originalName.replace('.pdf', '_czysty.pdf');
  
  link.setAttribute('download', newName || 'czysty.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
