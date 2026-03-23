# PDF Scanner Tools — Specyfikacja projektu

## Cel aplikacji

Aplikacja webowa z trzema modułami do analizy plików PDF skanowanych na ksero/drukarce:
1. **Zliczanie formatów** — rozpoznaje formaty stron (A0–A5, B-seria, Letter itp.), liczy m²
2. **Puste strony** — wykrywa puste strony, umożliwia pobranie PDF bez nich
3. **Kolor vs CzB** — liczy ile stron jest kolorowych, a ile czarno-białych

Aplikacja jest przeznaczona do użytku wewnętrznego w firmie — korzysta z niej kilka osób.

---

## Architektura interfejsu

### Układ: zakładki (tabs)

```
┌──────────────────────────────────────────────────┐
│  PDF Scanner Tools                               │
│                                                  │
│  [  Przeciągnij PDF tutaj lub kliknij  ]         │
│  plik: projekt_budowlany.pdf (142 stron)         │
│                                                  │
│  [ 📐 Formaty ]  [ 📄 Puste ]  [ 🎨 Kolor ]    │
│  ─────────────────────────────────────────────── │
│                                                  │
│  (wyniki aktywnej zakładki)                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Zasady działania:
- Strefa drag & drop jest WSPÓLNA na górze — plik wczytuje się raz
- Pod nią trzy zakładki — użytkownik przełącza między modułami
- Każdy moduł uruchamia swoją analizę DOPIERO po kliknięciu w zakładkę (lazy)
- Wyniki są cache'owane — po przełączeniu z powrotem nie analizuje ponownie
- Jeśli plik się zmieni (nowy upload) — cache się czyści
- Po wczytaniu pliku domyślnie otwiera się zakładka "Formaty"
- Każda zakładka ma: szybkie podsumowanie na górze + szczegóły rozwijane poniżej

---

## Stos technologiczny

- **Framework**: React (Vite)
- **Stylowanie**: Tailwind CSS
- **Parsowanie PDF**: pdf.js (Mozilla) — ładowany z CDN
- **Edycja PDF**: pdf-lib — do generowania PDF bez pustych stron
- **Język**: TypeScript
- **Hosting**: statyczny (Cloudflare Pages)
- **Brak backendu** — całość działa w przeglądarce

---

## Moduł 1: Zliczanie formatów (📐)

### Funkcjonalność
- Odczytuje wymiary każdej strony z metadanych PDF (szerokość × wysokość w punktach)
- Przelicza na milimetry: 1 punkt = 1/72 cala = 0.3528 mm
- Klasyfikuje format z tolerancją ±5 mm
- Rozpoznaje orientację: pionowo / poziomo

### Tabela formatów do rozpoznawania

```
Format    Szerokość (mm)    Wysokość (mm)
A0        841               1189
A1        594               841
A2        420               594
A3        297               420
A4        210               297
A5        148               210
B0        1000              1414
B1        707               1000
B2        500               707
B3        353               500
B4        250               353
B5        176               250
Letter    216               279
Legal     216               356
Tabloid   279               432
```

### Wyświetlanie wyników

**Podsumowanie (3 karty):**
- Łącznie stron
- Liczba formatów
- Łącznie m²

**Wykres słupkowy:** podział wg formatu (nazwa | słupek | liczba stron | m²)

**Szczegóły (rozwijane):** tabela z kolumnami: Nr strony | Format | Wymiary (mm) | Orientacja | m²

### Eksport
- "Eksportuj szczegóły CSV" — wszystkie strony
- "Eksportuj podsumowanie CSV" — grupowanie wg formatu + wiersz RAZEM
- Format CSV: separator średnik, UTF-8 BOM, polski nagłówek

### Logika rozpoznawania formatu

```
1. Przelicz punkty na mm:
   szerMm = (szerPt / 72) * 25.4
   wysMm  = (wysPt / 72) * 25.4

2. Posortuj: min = min(szerMm, wysMm), max = max(szerMm, wysMm)

3. Orientacja: szerMm > wysMm → "Poziomo", inaczej → "Pionowo"

4. Porównaj z tabelą (tolerancja ±5 mm na każdy wymiar):
   jeśli |min - format.szer| <= 5 ORAZ |max - format.wys| <= 5 → dopasowanie

5. Brak dopasowania → "Niestandardowy (min × max mm)"

6. Powierzchnia: (szerMm * wysMm) / 1_000_000  [m²]
```

---

## Moduł 2: Puste strony (📄)

### Funkcjonalność
- Renderuje każdą stronę na mały canvas (100×100 px) przez pdf.js
- Analizuje piksele — jeśli >98% pikseli ma jasność >240 (skala 0-255) → strona pusta
- Umożliwia pobranie nowego PDF z usuniętymi pustymi stronami (pdf-lib)

### Wyświetlanie wyników

**Podsumowanie (3 karty):**
- Łącznie stron
- Pustych stron
- Stron z treścią

**Lista pustych stron:** numery stron oznaczonych jako puste

**Szczegóły (rozwijane):** tabela: Nr strony | Status (Pusta / Z treścią)

### Akcje
- Przycisk "Pobierz PDF bez pustych stron" — generuje nowy plik przez pdf-lib
- Toggle "Próg wykrywania" — slider 90%–100% (domyślnie 98%) dla zaawansowanych

### Logika wykrywania pustej strony

```
1. Renderuj stronę na canvas 100×100 px (skala = 100/max(width, height))
2. Pobierz dane pikseli: ctx.getImageData(0, 0, 100, 100)
3. Dla każdego piksela oblicz jasność: (R + G + B) / 3
4. Jeśli jasność > 240 → piksel jasny
5. Jeśli >98% pikseli jasnych → strona pusta
```

### Pasek postępu
- Renderowanie stron jest wolne — pokaż postęp: "Analizuję stronę 42 z 400..."
- Przetwarzaj sekwencyjnie (jedna strona na raz)

---

## Moduł 3: Kolor vs Czarno-białe (🎨)

### Funkcjonalność
- Renderuje każdą stronę na canvas (150×150 px) przez pdf.js
- Analizuje piksele — sprawdza czy strona zawiera kolory czy jest czarno-biała/szara
- Zlicza strony kolorowe i czarno-białe

### Wyświetlanie wyników

**Podsumowanie (3 karty):**
- Łącznie stron
- Kolorowych
- Czarno-białych

**Wykres:** podział kolorowe vs czarno-białe

**Szczegóły (rozwijane):** tabela: Nr strony | Typ (Kolorowa / CzB) | Nasycenie koloru (%)

### Eksport
- "Eksportuj CSV" — lista stron z oznaczeniem kolor/czb

### Logika wykrywania koloru

```
1. Renderuj stronę na canvas 150×150 px
2. Pobierz dane pikseli: ctx.getImageData(...)
3. Dla każdego piksela:
   a. Oblicz nasycenie: max(R,G,B) - min(R,G,B)
   b. Pomiń piksele bardzo jasne (>240) i bardzo ciemne (<15) — to białe/czarne
   c. Jeśli nasycenie > 30 → piksel kolorowy
4. Jeśli >3% pikseli kolorowych → strona kolorowa
5. W przeciwnym razie → strona czarno-biała
```

### Pasek postępu
- "Analizuję kolory: strona 42 z 400..."

### Współdzielenie renderowania z Modułem 2
- Moduły 2 i 3 oba renderują strony na canvas
- Jeśli użytkownik odpali oba: NIE renderuj dwa razy
- Cache'uj wyrenderowane dane pikseli w pageRenderer.ts

---

## Wspólne komponenty

### DropZone
- Drag & drop + klik
- Nazwa pliku i liczba stron po wczytaniu
- Przycisk "Zmień plik"
- Obsługa dużych plików (info o szacowanym czasie przy >200 MB)

### ProgressBar
- Używany przez moduły 2 i 3
- Moduł 1 nie potrzebuje — odczyt wymiarów jest natychmiastowy
- Format: "Analizuję stronę X z Y..." + pasek procentowy

### ExportCSV
- Separator: średnik (;) — polski Excel
- Kodowanie: UTF-8 z BOM
- Współdzielona funkcja

---

## Struktura plików

```
pdf-scanner/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── GEMINI.md
├── AGENTS.md
├── architecture.md
├── .agents/skills/pdf-page-analyzer/SKILL.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── DropZone.tsx
│   │   ├── TabBar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── formats/
│   │   │   ├── FormatsTab.tsx
│   │   │   ├── FormatChart.tsx
│   │   │   └── FormatDetailsTable.tsx
│   │   ├── blanks/
│   │   │   ├── BlanksTab.tsx
│   │   │   └── BlankDetailsTable.tsx
│   │   └── colors/
│   │       ├── ColorsTab.tsx
│   │       ├── ColorChart.tsx
│   │       └── ColorDetailsTable.tsx
│   ├── utils/
│   │   ├── pdfLoader.ts
│   │   ├── pageClassifier.ts
│   │   ├── pageRenderer.ts       — wspólne renderowanie (cache)
│   │   ├── blankDetector.ts
│   │   ├── colorDetector.ts
│   │   ├── pdfCleaner.ts         — usuwanie pustych (pdf-lib)
│   │   └── csvExport.ts
│   ├── hooks/
│   │   ├── usePdfFile.ts
│   │   ├── useFormatsAnalysis.ts
│   │   ├── useBlanksAnalysis.ts
│   │   └── useColorsAnalysis.ts
│   └── styles/
│       └── index.css
```

---

## Wydajność

- Moduł 1 (formaty): natychmiastowy — czyta tylko metadane
- Moduły 2 i 3: wolniejsze — renderują strony na canvas
- Renderowanie sekwencyjne (strona po stronie)
- Cache pikseli między modułami 2 i 3 (pageRenderer.ts)
- Lazy loading — analiza dopiero po kliknięciu w zakładkę
- Przy >100 stron w tabeli: paginacja

---

## Formaty CSV

### Moduł 1 — szczegóły:
```
Nr strony;Format;Szerokość (mm);Wysokość (mm);Orientacja;Powierzchnia (m²)
```

### Moduł 1 — podsumowanie:
```
Format;Liczba stron;Powierzchnia (m²)
```

### Moduł 3 — kolor:
```
Nr strony;Typ;Nasycenie (%)
```

Separator: ; | Kodowanie: UTF-8 BOM | Liczby dziesiętne: kropka

---

## Uruchomienie

```bash
npm install
npm run dev
npm run build        # produkcja → dist/
```

---

## Przyszłe rozszerzenia (v2)

- [ ] Cennik: cena za m² / za stronę kolorową / za stronę czb
- [ ] Obsługa wielu plików PDF naraz (batch)
- [ ] Eksport raportu jako PDF
- [ ] Historia analiz
- [ ] Tryb jasny / ciemny
- [ ] Podgląd miniaturek stron
