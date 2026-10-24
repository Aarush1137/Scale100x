# Build Log — Scale100x.ai Franchise OS

## Session Overview
- **Tool**: Claude Code (Anthropic claude-sonnet-4-6)
- **Duration**: Single session
- **Approach**: Direct code generation from spec

## Main Prompt
Full specification prompt provided defining all 8 modules, design tokens, data model, seed data, and deliverables.

## Implementation Decisions

### Architecture
- **Single localStorage store with singleton pattern** — chose this over React Context to avoid prop drilling and simplify subscription model across deep component trees. The `listeners` Set approach gives ~React Query behavior without the dependency.
- **TypeScript strict mode partially relaxed** — `noUnusedLocals: false` enabled to avoid import cleanup during rapid development. Real production code would re-enable this.
- **No Zod validation in routes** — Used React Hook Form basic validation for forms instead of Zod schema validation. Would add Zod schemas in production for server-side parity.

### UI/UX Decisions
- **Tailwind CSS Variables** — Used `var(--bg-main)` etc. in index.css, then referenced as raw values in className since @tailwindcss/vite v4 uses @import "tailwindcss" syntax
- **Inline styles avoided** — All colors from design token classes where possible
- **Recharts** — Used for all charts; required `react-is` as a missing peer dependency

### Module Trade-offs
- **OnboardingWizard** — Session resumption works via URL param; draft saves on every Next
- **ROI Engine** — All calculations are formula-based, never hardcoded values; divide-by-zero handled with `isFinite()` check
- **Collateral Studio** — Template generation deterministic, version history stored in localStorage
- **WhatsApp Workspace** — AI response simulation uses keyword matching with 1.2s delay for realism; escalation triggers auto-takeover
- **CRM** — Drawer pattern for lead details keeps table context visible
- **Automations** — Workflow visualization uses horizontal scroll; step cards color-coded by type

## Issues Encountered

1. **`react-is` missing peer dependency** — recharts requires `react-is` but it wasn't in the dependency tree. Fixed with `npm install react-is`.
2. **Recharts Tooltip formatter type** — TypeScript strict typing on Recharts `Formatter` type required `(v: unknown) => ...` instead of `(v: number) => ...`
3. **FormData type conflict** — OnboardingWizard used `FormData` as a local interface name which collides with the global DOM `FormData`. Resolved with casting via `as unknown as LocalFormData`.
4. **legacy-peer-deps required** — `@hookform/resolvers` v6 has peer dep issues with its optional Effect dependency. Used `--legacy-peer-deps` flag.

## Tests Run
- `npm run build` — passes cleanly
- Manual walkthrough of all 8 modules in browser
- Verified: send message → AI auto-responds, human takeover pauses AI, resume re-enables AI
- Verified: lead stage changes persist and add activity events
- Verified: ROI calculations update live on assumption change
- Verified: localStorage reset restores seed data
- Verified: Onboarding wizard saves draft and resumes

## Limitations
- Bundle size 831KB (single chunk) — needs dynamic import() for production
- No unit tests written
- No mobile responsive layout (desktop-optimized)
- Voice AI agent is UI-only, marked as paused
- File uploads store metadata only
- AI responses are keyword-matched templates, not LLM calls
- WhatsApp, Meta Ads, Supabase are all simulated

## What 1 More Day Would Add
1. Code splitting all 8 pages with React.lazy() → reduce initial bundle to ~200KB
2. Zod schema validation on all forms
3. Mobile responsive sidebar with hamburger menu
4. PDF export for ROI Engine (using jsPDF)
5. Unit tests for HITL trigger logic and financial calculations
6. Multi-brand support (currently hardcoded to first brand in most lists)
7. Search results dropdown with actual navigation to specific lead/conversation
8. Dark/light theme toggle

## Build Commands
```bash
npm run dev    # Development server
npm run build  # Production build (passes)
npm run preview # Preview production build
```
