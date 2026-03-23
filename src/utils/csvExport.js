/**
 * Generuje i pobiera plik CSV
 * @param {Array} data - Dane do eksportu
 * @param {Array} headers - Nagłówki kolumn
 * @param {string} filename - Nazwa pliku
 */
const downloadCsv = (data, headers, filename) => {
  // BOM dla Excela (UTF-8)
  const BOM = '\uFEFF';
  const csvContent = [
    headers.join(';'),
    ...data.map(row => row.join(';'))
  ].join('\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Eksportuje szczegółową listę stron do CSV
 * @param {Array} results - Wyniki analizy
 */
export const exportDetailedCsv = (results) => {
  const headers = ['Nr strony', 'Plik', 'Format', 'Szerokość (mm)', 'Wysokość (mm)', 'Orientacja', 'Powierzchnia (m²)'];
  const data = results.map(r => [
    r.pageNumber,
    r.fileName || '-',
    r.name,
    r.widthMm,
    r.heightMm,
    r.orientation,
    r.area.toString().replace('.', ',') // Polska konwencja przecinka
  ]);

  downloadCsv(data, headers, 'analiza_pdf_szczegoly.csv');
};

/**
 * Eksportuje podsumowanie formatów do CSV
 * @param {Array} results - Wyniki analizy
 */
export const exportSummaryCsv = (results) => {
  const summary = results.reduce((acc, r) => {
    if (!acc[r.name]) {
      acc[r.name] = { count: 0, area: 0 };
    }
    acc[r.name].count += 1;
    acc[r.name].area += r.area;
    return acc;
  }, {});

  const headers = ['Format', 'Liczba stron', 'Powierzchnia (m²)'];
  const data = Object.entries(summary).map(([name, stats]) => [
    name,
    stats.count,
    stats.area.toFixed(4).replace('.', ',')
  ]);

  const totalArea = results.reduce((sum, r) => sum + r.area, 0);
  data.push(['RAZEM', results.length, totalArea.toFixed(4).replace('.', ',')]);

  downloadCsv(data, headers, 'analiza_pdf_podsumowanie.csv');
};

/**
 * Eksportuje szczegółową listę stron kolorowych do CSV
 * @param {Array} results - Wyniki analizy barwności
 */
export const exportColorsCsv = (results) => {
  const headers = ['Nr strony', 'Plik', 'Typ', 'Nasycenie (%)'];
  const data = results.map(r => [
    r.pageNumber,
    r.fileName || '-',
    r.isColor ? 'Kolorowa' : 'Czarno-biała',
    r.saturation.toFixed(2).replace('.', ',')
  ]);

  downloadCsv(data, headers, 'analiza_pdf_kolory.csv');
};
