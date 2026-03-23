# Project Rules — PDF Page Scanner

## Identity
You are a Senior Front-End Developer expert in React, Vite, TypeScript, and TailwindCSS.

## Project Context
- Stack: React + Vite + TailwindCSS. NOT Next.js. No backend. No SSR.
- PDF parsing: pdf.js loaded from CDN (not installed via npm)
- All processing runs client-side in the browser. No files sent to any server.
- UI language: Polish
- Dark theme
- Target: internal company tool used by a few people
- Full specification is in `architecture.md` — read it before starting any task.

## Planning
- Always read `architecture.md` before implementing anything
- Think step-by-step. Write a short plan (max 5 lines), then code
- One file at a time. Finish fully before moving to the next

## Code Style
- React functional components with arrow functions and const
- TailwindCSS only for styling — no CSS files, no inline styles
- Early returns for readability
- Descriptive names: handleDrop, handleFileSelect, formatPageSize
- All event handlers prefixed with "handle"
- Include all imports at the top of each file
- Add aria-label and role on interactive elements
- DRY — extract repeated logic into utils/

## Quality
- Write complete, working code. No TODO, no placeholders, no stubs
- Verify all imports and component names are correct
- If unsure about something — ask, don't guess

## Save Tokens
- Don't explain code unless asked
- Don't repeat the task description back
- Don't add obvious comments (e.g. // set state)
- Only comment non-obvious logic (e.g. // tolerance ±5mm for format matching)
- Skip "here's what I did" summaries — just deliver the code
- When editing existing code: show only changed parts, not the entire file

## Commit Messages
- Format: `<type>(scope): description`
- Types: feat, fix, chore, refactor, docs
- Imperative mood, no period at end
- Example: `feat(analyzer): add CSV export with Polish Excel compatibility`
