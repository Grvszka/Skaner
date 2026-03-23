---
name: pdf-page-analyzer
description: >
  Use this skill when building or modifying the PDF page size analyzer.
  Covers: reading PDF page dimensions with pdf.js, classifying paper formats
  (A0-A5, B-series, Letter, Legal, Tabloid) with ±5mm tolerance,
  calculating area in m², generating CSV exports for Polish Excel.
---

# PDF Page Analysis Logic

## Page Size Detection

1 PDF point = 1/72 inch = 0.3528 mm

```
widthMm = (widthPt / 72) * 25.4
heightMm = (heightPt / 72) * 25.4
```

Sort dimensions: min × max (ignore orientation for matching).

## Standard Formats Table (mm)

| Format  | Width | Height |
|---------|-------|--------|
| A0      | 841   | 1189   |
| A1      | 594   | 841    |
| A2      | 420   | 594    |
| A3      | 297   | 420    |
| A4      | 210   | 297    |
| A5      | 148   | 210    |
| B0      | 1000  | 1414   |
| B1      | 707   | 1000   |
| B2      | 500   | 707    |
| B3      | 353   | 500    |
| B4      | 250   | 353    |
| B5      | 176   | 250    |
| Letter  | 216   | 279    |
| Legal   | 216   | 356    |
| Tabloid | 279   | 432    |

Matching tolerance: ±5 mm per dimension.

## Area Calculation

```
areaSqM = (widthMm * heightMm) / 1_000_000
```

## CSV Export Rules

- Separator: semicolon (;) — for Polish Excel
- Encoding: UTF-8 with BOM (\uFEFF)
- Decimal separator: dot (.)

### Detail CSV columns:
Nr strony;Format;Szerokość (mm);Wysokość (mm);Orientacja;Powierzchnia (m²)

### Summary CSV columns:
Format;Liczba stron;Powierzchnia (m²)
(last row: RAZEM with totals)

## pdf.js Usage

Load from CDN, not npm:
```
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js
```

Process pages sequentially (one at a time) to handle large files.
Only read viewport dimensions — do not render page content.
