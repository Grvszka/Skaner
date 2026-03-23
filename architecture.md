# PDF Page Scanner — Specyfikacja projektu

## Cel aplikacji

Aplikacja webowa do analizy plików PDF skanowanych na ksero/drukarce.
Program odczytuje wymiary każdej strony w PDF, rozpoznaje format papieru (A0–A5, B-seria, Letter, Legal itp.), zlicza ile stron danego formatu jest w pliku i wylicza łączną powierzchnię w metrach kwadratowych (m²).

Aplikacja jest przeznaczona do użytku wewnętrznego w firmie — korzysta z niej kilka osób.

---

## Stos technologiczny

- **Framework**: React (Vite)
- **Stylowanie**: Tailwind CSS
- **Parsowanie PDF**: pdf.js (biblioteka Mozilla) — ładowana z CDN
- **Język**: JavaScript / TypeScript (do wyboru)
- **Hosting**: statyczny (Vercel, Netlify lub serwer lokalny)
- **Brak backendu** — całość działa w przeglądarce, żaden plik nie jest wysyłany na serwer

---

## Funkcjonalności

### 1. Wczytywanie pliku PDF
- Przeciągnij i upuść (drag & drop) plik PDF na strefę uploadu
- Alternatywnie: kliknij aby wybrać plik z dysku
- Obsługa dużych plików (do 500 MB) — przetwarzanie sekwencyjne, strona po stronie
- Pasek postępu pokazujący ile stron zostało przeanalizowanych (np. "Analizuję stronę 142 z 400...")
- Ostrzeżenie jeśli plik przekracza 500 MB

### 2. Rozpoznawanie formatu strony
- Odczytanie wymiarów strony z metadanych PDF (szerokość × wysokość w punktach)
- Przeliczenie na milimetry: `1 punkt = 1/72 cala = 0.3528 mm`
- Porównanie z tabelą standardowych formatów z tolerancją ±5 mm
- Rozpoznawanie orientacji: pionowo (portrait) / poziomo (landscape)
- Strony niestandardowe oznaczone jako "Niestandardowy (szer × wys mm)"

### 3. Tabela standardowych formatów do rozpoznawania

```
Format    Szerokość (mm)    Wysokość (mm)    Powierzchnia (m²)
A0        841               1189             1.0000
A1        594               841              0.5000
A2        420               594              0.2500
A3        297               420              0.1250
A4        210               297              0.0625
A5        148               210              0.0311
B0        1000              1414             1.4140
B1        707               1000             0.7070
B2        500               707              0.3535
B3        353               500              0.1765
B4        250               353              0.0883
B5        176               250              0.0440
Letter    216               279              0.0603
Legal     216               356              0.0769
Tabloid   279               432              0.1205
```

Porównanie odbywa się na wymiarach posortowanych (mniejszy × większy), niezależnie od orientacji.

### 4. Wyświetlanie wyników

#### Sekcja podsumowania (3 karty na górze):
- **Łącznie stron** — całkowita liczba stron w PDF
- **Formatów** — ile różnych formatów wykryto
- **Łącznie m²** — suma powierzchni wszystkich stron

#### Wykres słupkowy podziału wg formatu:
- Każdy wykryty format jako wiersz
- Słupek proporcjonalny do liczby stron
- Obok: liczba stron + powierzchnia w m²
- Sortowanie: od najczęstszego formatu

#### Tabela szczegółów (rozwijana):
- Kolumny: Nr strony | Format | Wymiary (mm) | Orientacja | m²
- Domyślnie zwinięta, rozwijana przyciskiem
- Przy dużej liczbie stron: paginacja lub wirtualna lista (żeby przeglądarka się nie zawiesiła przy 400+ wierszach)

### 5. Eksport wyników
- Przycisk "Eksportuj do CSV" — pobieranie pliku CSV z pełną listą stron
- Przycisk "Eksportuj podsumowanie" — pobieranie CSV z podsumowaniem wg formatów
- Format CSV zgodny z Excelem (separator: średnik, kodowanie: UTF-8 BOM)

### 6. Opcjonalnie: Cennik
- Możliwość wpisania ceny za m² (lub za stronę danego formatu)
- Automatyczne wyliczenie kosztu zlecenia
- To może być dodane w drugiej kolejności

---

## Wygląd i UX

### Design
- Ciemny motyw (dark theme)
- Nowoczesny, czysty interfejs
- Czcionki: czytelne, monospace dla liczb
- Kolory akcentowe: cyjan/turkus dla danych, fiolet dla wykresów, zielony dla m²
- Animacje: płynne pojawianie się wyników, animowany pasek postępu

### Responsywność
- Działa na desktopie i tablecie
- Na telefonie: podstawowa funkcjonalność (choć główne użycie to desktop)

### Język interfejsu
- Polski

---

## Struktura plików projektu

```
pdf-scanner/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── DropZone.jsx          — strefa drag & drop
│   │   ├── ProgressBar.jsx       — pasek postępu analizy
│   │   ├── SummaryCards.jsx      — 3 karty podsumowania
│   │   ├── FormatChart.jsx       — wykres słupkowy formatów
│   │   ├── PageDetailsTable.jsx  — tabela szczegółów stron
│   │   └── ExportButtons.jsx     — przyciski eksportu CSV
│   ├── utils/
│   │   ├── pdfAnalyzer.js        — logika parsowania PDF (pdf.js)
│   │   ├── pageClassifier.js     — rozpoznawanie formatu strony
│   │   └── csvExport.js          — generowanie plików CSV
│   └── styles/
│       └── index.css             — globalne style + Tailwind
```

---

## Logika rozpoznawania formatu (pageClassifier.js)

```
Wejście: szerokość i wysokość strony w punktach PDF

1. Przelicz na milimetry:
   szerMm = (szerPt / 72) * 25.4
   wysMm  = (wysPt / 72) * 25.4

2. Posortuj wymiary:
   minWymiar = min(szerMm, wysMm)
   maxWymiar = max(szerMm, wysMm)

3. Określ orientację:
   jeśli szerMm > wysMm → "Poziomo"
   w przeciwnym razie → "Pionowo"

4. Porównaj z tabelą formatów (tolerancja ±5 mm na każdy wymiar):
   dla każdego formatu:
     jeśli |minWymiar - format.szer| <= 5 ORAZ |maxWymiar - format.wys| <= 5:
       → zwróć nazwę formatu

5. Jeśli brak dopasowania:
   → zwróć "Niestandardowy (minWymiar × maxWymiar mm)"

6. Oblicz powierzchnię w m²:
   powierzchnia = (szerMm * wysMm) / 1_000_000
```

---

## Logika parsowania PDF (pdfAnalyzer.js)

```
1. Wczytaj plik jako ArrayBuffer
2. Załaduj pdf.js z CDN (jeśli jeszcze nie załadowany)
3. Otwórz dokument: pdfjsLib.getDocument({ data: arrayBuffer })
4. Dla każdej strony (sekwencyjnie, jedna po drugiej):
   a. Pobierz stronę: pdf.getPage(numer)
   b. Pobierz viewport: page.getViewport({ scale: 1.0 })
   c. Odczytaj wymiary: viewport.width, viewport.height (w punktach)
   d. Sklasyfikuj format strony
   e. Zaktualizuj pasek postępu
5. Zwróć tablicę wyników
```

---

## Eksport CSV (csvExport.js)

### Plik szczegółowy (wszystkie strony):
```
Nr strony;Format;Szerokość (mm);Wysokość (mm);Orientacja;Powierzchnia (m²)
1;A4;210;297;Pionowo;0.0624
2;A3;297;420;Pionowo;0.1247
3;A4;297;210;Poziomo;0.0624
```

### Plik podsumowania:
```
Format;Liczba stron;Powierzchnia (m²)
A4;285;17.8125
A3;100;12.5000
A1;15;7.5000
RAZEM;400;37.8125
```

- Separator: średnik (`;`) — aby Excel poprawnie otwierał w polskiej wersji
- Kodowanie: UTF-8 z BOM (`\uFEFF` na początku pliku)
- Liczby dziesiętne: z kropką (Excel obsługuje obie konwencje)

---

## Wydajność

- Przetwarzanie sekwencyjne (strona po stronie) — nie ładuj wszystkich stron naraz
- Przy >100 stron w tabeli szczegółów: użyj wirtualizacji listy (np. react-window) lub paginacji
- Pasek postępu aktualizowany co stronę
- Odczyt wymiarów strony jest lekki (nie renderujemy zawartości, tylko czytamy metadane)

---

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje na `http://localhost:5173`

### Budowanie do produkcji:
```bash
npm run build
```

Wynik w folderze `dist/` — gotowy do wrzucenia na dowolny hosting statyczny.

---

## Przyszłe rozszerzenia (v2)

- [ ] Cennik: możliwość ustawienia ceny za m² lub za stronę danego formatu
- [ ] Obsługa wielu plików PDF naraz (batch)
- [ ] Historia analiz (localStorage)
- [ ] Drukowanie raportu
- [ ] Tryb jasny / ciemny (przełącznik)
