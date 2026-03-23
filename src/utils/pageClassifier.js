/**
 * Tabela standardowych formatów papieru
 */
const FORMATS = [
  { name: 'A0', width: 841, height: 1189, area: 1.0000 },
  { name: 'A1', width: 594, height: 841, area: 0.5000 },
  { name: 'A2', width: 420, height: 594, area: 0.2500 },
  { name: 'A3', width: 297, height: 420, area: 0.1250 },
  { name: 'A4', width: 210, height: 297, area: 0.0625 },
  { name: 'A5', width: 148, height: 210, area: 0.0311 },
  { name: 'B0', width: 1000, height: 1414, area: 1.4140 },
  { name: 'B1', width: 707, height: 1000, area: 0.7070 },
  { name: 'B2', width: 500, height: 707, area: 0.3535 },
  { name: 'B3', width: 353, height: 500, area: 0.1765 },
  { name: 'B4', width: 250, height: 353, area: 0.0883 },
  { name: 'B5', width: 176, height: 250, area: 0.0440 },
  { name: 'Letter', width: 216, height: 279, area: 0.0603 },
  { name: 'Legal', width: 216, height: 356, area: 0.0769 },
  { name: 'Tabloid', width: 279, height: 432, area: 0.1205 },
];

/**
 * Klasyfikuje format strony na podstawie wymiarów w punktach PDF
 * @param {number} widthPt - Szerokość w punktach
 * @param {number} heightPt - Wysokość w punktach
 * @returns {Object} - Obiekt z danymi strony
 */
export const classifyPage = (widthPt, heightPt) => {
  // 1 punkt = 1/72 cala = 0.3528 mm (25.4 / 72)
  const mmPerPt = 25.4 / 72;
  const widthMm = widthPt * mmPerPt;
  const heightMm = heightPt * mmPerPt;

  const minWymiar = Math.min(widthMm, heightMm);
  const maxWymiar = Math.max(widthMm, heightMm);
  const orientation = widthMm > heightMm ? 'Poziomo' : 'Pionowo';

  // Tolerancja +/- 5mm
  const tolerance = 5;

  const matchedFormat = FORMATS.find(f => 
    Math.abs(minWymiar - f.width) <= tolerance && 
    Math.abs(maxWymiar - f.height) <= tolerance
  );

  const name = matchedFormat 
    ? matchedFormat.name 
    : `Niestandardowy (${Math.round(widthMm)}x${Math.round(heightMm)} mm)`;
  
  const area = (widthMm * heightMm) / 1_000_000;

  return {
    name,
    widthMm: Math.round(widthMm),
    heightMm: Math.round(heightMm),
    orientation,
    area: Number(area.toFixed(4))
  };
};
