/**
 * Analizuje dane pikseli z canvas i określa nasycenie kolorów.
 * @param {ImageData} imageData 
 * @param {number} colorThreshold - minimalne nasycenie dla koloru (domyślnie 30)
 * @param {number} pixelRatioThreshold - próg % pikseli by strona była kolorowa (domyślnie 3%)
 * @returns {object} { isColor: boolean, colorSaturation: number }
 */
export const identifyPageColor = (imageData, colorThreshold = 30, pixelRatioThreshold = 3) => {
  const data = imageData.data;
  let colorPixels = 0;
  let validPixels = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Ignorowanie szumu jasnego/ciemnego z wydruku
    if (r > 240 && g > 240 && b > 240) continue;
    if (r < 15 && g < 15 && b < 15) continue;
    
    validPixels++;
    
    const maxCode = Math.max(r, g, b);
    const minCode = Math.min(r, g, b);
    const saturation = maxCode - minCode;
    
    if (saturation > colorThreshold) {
      colorPixels++;
    }
  }

  let colorPercentage = 0;
  if (validPixels > 0) {
    colorPercentage = (colorPixels / validPixels) * 100;
  }
  
  return {
    isColor: colorPercentage >= pixelRatioThreshold,
    colorSaturation: colorPercentage
  };
};
