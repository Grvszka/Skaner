---
name: pdf-scanner-tools
description: >
  Use this skill when building or modifying any of the three PDF analysis modules:
  (1) page format classification (A0-A5, B-series, Letter, Legal) with m² calculation,
  (2) blank page detection and removal,
  (3) color vs black-and-white page detection.
  Covers: pdf.js rendering, pixel analysis, pdf-lib manipulation, CSV export for Polish Excel.
---

# PDF Scanner Tools — Technical Reference

## pdf.js Setup

Load from CDN (not npm):
```
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js
```

## Module 1: Format Classification

1 PDF point = 1/72 inch = 0.3528 mm

```
widthMm = (widthPt / 72) * 25.4
heightMm = (heightPt / 72) * 25.4
areaSqM = (widthMm * heightMm) / 1_000_000
```

Sort dimensions min × max before matching. Tolerance: ±5 mm per dimension.

| Format  | W (mm) | H (mm) |
|---------|--------|--------|
| A0      | 841    | 1189   |
| A1      | 594    | 841    |
| A2      | 420    | 594    |
| A3      | 297    | 420    |
| A4      | 210    | 297    |
| A5      | 148    | 210    |
| B0      | 1000   | 1414   |
| B1      | 707    | 1000   |
| B2      | 500    | 707    |
| B3      | 353    | 500    |
| B4      | 250    | 353    |
| B5      | 176    | 250    |
| Letter  | 216    | 279    |
| Legal   | 216    | 356    |
| Tabloid | 279    | 432    |

No rendering needed — reads viewport metadata only. Instant even on 1000+ pages.

## Module 2: Blank Page Detection

Render each page to 100×100 px canvas. Analyze pixels:
- Brightness = (R + G + B) / 3
- Pixel is bright if brightness > 240
- Page is blank if >98% pixels are bright

Use pdf-lib (npm install pdf-lib) to generate cleaned PDF without blank pages.

## Module 3: Color vs Black-and-White

Render each page to 150×150 px canvas. Analyze pixels:
- Saturation = max(R,G,B) - min(R,G,B)
- Skip pixels with brightness >240 (white) or <15 (black)
- Pixel is colorful if saturation > 30
- Page is color if >3% pixels are colorful

## Shared Rendering Cache (pageRenderer.ts)

Modules 2 and 3 both render pages. Cache rendered pixel data to avoid double rendering.
Process pages sequentially (one at a time) for memory safety on large files.

## CSV Export Rules

- Separator: semicolon (;) — for Polish Excel
- Encoding: UTF-8 with BOM (\uFEFF)
- Decimal separator: dot (.)
