# AGENTS.md — Cross-Tool Rules

## Stack
- React 18+ with Vite
- TailwindCSS for styling
- pdf.js for PDF parsing (CDN, not npm)
- No backend, no SSR, no Next.js

## Code Conventions
- Functional components with arrow functions
- TailwindCSS classes only — no CSS files
- Early returns for readability
- Descriptive variable names
- Event handlers prefixed with "handle"
- Extract shared logic to utils/
- All imports explicit at top of file

## Quality
- No TODO or placeholder code
- Complete implementations only
- Accessibility: aria-label, role, tabindex on interactive elements

## Language
- UI text in Polish
- Code and comments in English
