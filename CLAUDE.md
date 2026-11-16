# CLAUDE.md

Guidance for AI coding assistants working in this repo. Read SPEC.md first; it is the source of truth for behavior.

## Project
Apology Helper: a one-page web app. The user writes an apology; a rule-based checker flags phrases that often backfire, phrased as dismissable questions. Built as a 1-hour internship assignment, so scope discipline matters more than polish.

## Stack
- Vite + React 18 + TypeScript. No other runtime dependencies (no UI libs, no state libs, no router).
- Layout: `src/checker/` (pure TS: types, rules, check, hints, tests), `src/components/` (+ `overlays/`), `src/hooks/`, `src/data/templates.ts`, `src/styles/index.css`.
- Tests: vitest (`npm test`) runs the SPEC test cases in `src/checker/checker.test.ts`.
- Dev: `npm run dev`. Deploy the `dist/` output as a static site (GitHub Pages or Netlify).

## Hard rules
- **No AI in the product.** The app never generates, rewrites, or suggests apology text. All flags come from the rules in `checker.js`.
- **No network calls, no storage.** No fetch, no analytics, no localStorage/sessionStorage/IndexedDB. A refresh clears everything.
- **No backend, accounts, or database.**
- **Never block the user.** Flags inform; they never disable copying. Only the 3-item checklist gates "Continue".
- **Flag copy is a question, not a verdict.** Use "This may…" / "Does this…?" Never "wrong" or "you can't say that."

## Code conventions
- `checker.js` is pure: `export function check(text) -> Flag[]` and `export function messageHints(text) -> string[]`. No DOM access.
- Rules are data (`{ id, strength, pattern, question }`) in one array so they're easy to read and tune.
- Debounce checking at ~300ms.
- When strong and weak flags overlap, keep the strong one.
- Keep the whole app small (aim for under ~300 lines of JS total). If a feature needs much more, it's out of scope.

## UI notes
- One main screen; starter, checklist, and pause are overlays. Only one overlay at a time. Close on X, Back, Escape, or backdrop click; return focus to the textarea.
- v1 shows flags as cards under the textarea. Inline highlighting (backdrop/mirror technique) is a stretch goal only.
- Mobile-first: works at 375px wide, tap targets ≥ 44px, readable font (16px+ in the textarea to avoid iOS zoom).
- Accessible basics: labels on inputs, buttons are `<button>`, overlays use `role="dialog"` and `aria-modal="true"`.

## Testing
- The 10 test cases in SPEC.md are the acceptance tests. If a rule change breaks one, fix the rule, not the test, unless the test is wrong.
- Run with `npm test`.

## Out of scope (don't add even if it seems helpful)
AI rewrites, sentiment analysis, saving drafts, sharing links, accounts, multiple languages, themes, analytics.
