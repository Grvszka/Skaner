/**
 * Analizuje dane pikseli z canvas i określa jasność
 * @param {ImageData} imageData 
 * @param {number} threshold - tolerancja procentowa (0-100), domyślnie 99.5
 * @returns {boolean} - true jeśli pusta
 */
export const isPageBlank = (imageData, threshold = 99.5) => {
  const data = imageData.data;
  let brightPixels = 0;
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Jasność ze wzoru z specyfikacji (R + G + B) / 3 > 240
    const brightness = (r + g + b) / 3;
    if (brightness > 240) {
      brightPixels++;
    }
  }

  const brightPercentage = (brightPixels / totalPixels) * 100;
  return brightPercentage >= threshold;
};
