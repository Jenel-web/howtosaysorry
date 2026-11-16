# Sorry, Properly

A one-page web app that helps you write a better apology. You write in your own words. A rule-based checker flags phrases that often backfire, and each flag is a **question you can dismiss**, never a verdict. Nothing is saved, sent, or generated.

> "I'm sorry you feel that way." → *This can sound like the problem is their reaction. Can you name what you did?*

---

## Contents

1. [The problem](#the-problem)
2. [What it does](#what-it-does)
3. [How the checker works](#how-the-checker-works)
4. [Decisions, and why](#decisions-and-why)
5. [Limitations](#limitations)
6. [What the checker is based on](#what-the-checker-is-based-on)
7. [Hard rules and non-goals](#hard-rules-and-non-goals)
8. [Getting started](#getting-started)
9. [Project layout](#project-layout)
10. [Changing or adding a rule](#changing-or-adding-a-rule)
11. [Accessibility, privacy, and design](#accessibility-privacy-and-design)
12. [Known issues and next steps](#known-issues-and-next-steps)

---

## The problem

When we are scared or defensive, we apologize badly. We add "but", blame the other person's reaction, explain at length, ask to be forgiven right away, or say "I didn't mean it" before we say what we did. The apology then makes the conflict bigger instead of smaller, and the writer often doesn't notice, because every one of these phrases feels like an apology from the inside.

Existing options don't help much at the moment it matters:

- **Advice articles** list bad phrases, but you have to remember them while you are upset.
- **AI rewriters** produce smooth text, but the words stop being yours. A polished apology you didn't write can read as insincere, and the app would be putting words in your mouth.
- **Spell and grammar checkers** can't tell that a perfectly grammatical sentence is a deflection.

**Sorry, Properly** sits in the gap. It reads what you wrote, points at the specific phrases that tend to land badly, and asks a short question about each one. You decide what to change. The words stay 100% yours.

It is built for everyday conflicts: a missed birthday, a harsh text, a broken promise. It is **not** for abuse or safety situations.

---

## What it does

**One main screen**, with everything else as an overlay on top of it:

| Part | What happens |
|---|---|
| **Wordmark and heading** | "Sorry, Properly" at the top-left, then "Say sorry, properly" with a one-line promise that nothing is saved or sent. |
| **Writing box** | Type your apology. A word count sits below it. |
| **Flag cards** | About 300ms after you stop typing, flagged phrases appear as cards under the box, each quoting the phrase and asking a question. **Red** = "things to look at", **normal** = "worth a second look". Each card has **Ignore** and **Show in text** (selects the phrase in the box). |
| **Hints** | Message-level nudges under the box: no "sorry" yet, too brief, very long, "sorry" three or more times, and situations the wording suggests (they asked for space, a public or group apology, legal wording, taking on all the blame). |
| **Need a start?** | A starter overlay: pick a feeling (Guilty, Hurt, Angry, Shame, Humility, Hope) and choose from five fill-in-the-blank templates each. If you already wrote something you choose **Replace it** or **Add below it**. |
| **Ready to send?** | A checklist overlay. Only three ticks unlock **Continue**: *I said what I did*, *I said how it affected them*, *I said what I'll do differently*. If red flags remain, it says how many and offers **Review them**. |
| **Pause** | "Read it out loud first." Two reminders (has the other person cooled off? did they ask for space?) and a **Copy message** button. |
| **Clear** | Confirms, then empties the box. |

**Flags never block you.** You can always copy your message. The only gate is the three-item checklist, and that is a prompt to reflect, not a filter.

---

## How the checker works

The checker is pure TypeScript with no DOM access, so it is easy to test: `check(text) → Flag[]` and `messageHints(text) → string[]`.

### Two kinds of rule

**1. Idioms (regex).** For fixed phrases where the exact words are the point: "mistakes were made", "sorry not sorry", "just a joke". These live in [`rules.ts`](src/checker/rules.ts).

**2. Word-distance rules.** For ideas that people word a hundred ways. Instead of matching one string, a rule names the **2–3 key words** that carry the meaning and how close together they must be. These live in [`concepts.ts`](src/checker/concepts.ts) and use the matcher in [`near.ts`](src/checker/near.ts).

There are two matchers:

```ts
// near: key words in ANY order, all within N words of each other
{ id: 'blame_shift', strength: 'strong',
  near: [['push*', 'press*'], ['button*']], within: 5 }
// catches: "you really push my buttons", "pressing all my buttons",
//          "my buttons keep getting pressed by you"

// seq: key words in THIS order, each within `gap` words of the last
{ id: 'sorry_you_feel', strength: 'strong',
  seq: ['@sorry', '@you', '@reaction'], gap: 4, stop: ['@first', '@if'] }
// catches: "sorry that you ended up feeling hurt"
// but NOT:  "sorry I hurt you"  (the stop word "I" blocks it)
```

- `@name` refers to a **word group** in [`lexicon.ts`](src/checker/lexicon.ts) (`@sorry` = sorry, apologize, apologies, regret…). Add a synonym to a group and every rule using it improves.
- `word*` matches any ending (`offend*` → offend, offended, offensive).
- `unless` / `stop` cancel a match (`not` in "it's *not* your fault"; `I` in "sorry *I* hurt you").
- `also` requires another word somewhere in the same sentence.
- Text is **tokenized** first: "can't" → *can not*, "you're" → *you are*, "I'll" → *I will*, so rules see plain words. Matches don't cross a `.` `!` `?` unless a rule allows it.

### Two levels

| Level | Looks like | Used for |
|---|---|---|
| **Red** (`strong`) | "things to look at" | Patterns with named expert backing, or plainly not apologies: "sorry you feel", "sorry if I hurt you", "sorry, but…", blame ("it's your fault", "you push my buttons"), "it's not my fault", minimizing, "mistakes were made", forgiveness demands, "you know I didn't mean that". |
| **Normal** (`weak`) | "worth a second look" | Thinner evidence, or easily innocent: loose "but", hedging, denying intent ("I didn't mean to"), "I didn't realize", calling it an accident, "that wasn't me", over-promising, vague apologies, self-pity, "let's move on". |

About 40 named rules (roughly 130 rule definitions) are grouped like this:

- **Shifting the problem onto them:** "sorry you feel", conditional "if", "you took it the wrong way", blame, minimizing, "you always/never".
- **Cancelling or dodging:** "sorry, but", agentless passive ("mistakes were made"), sorry-not-sorry, sarcasm, generic audience ("anyone I may have hurt").
- **Denying intent or awareness:** "I didn't mean it that way", "it's not my intention", "I didn't realize", "it came out wrong", "that's not who I am", "no offense".
- **Asking for something back:** "what more do you want?", "are we good?", "you should apologize too", "let's move on", self-pity that asks to be reassured.
- **Vague or excessive:** "sorry for everything", repeated "sorry", "I'll try to do better", "I'll never do it again".

### Staying quiet when it should

Because the matcher is generous, each rule can carry **guards** that stop it flagging harmless uses:

- Text inside **"quotes"** is skipped (you're quoting what someone said).
- **Negation:** "I'm not saying you're overreacting".
- **Sympathy:** "sorry for your loss", "sorry you're going through this".
- **Refusals and invitations:** "sorry, but I can't make it", "I'm sorry. But I'd like to explain when you're ready".
- **Warm uses:** "you always matter to me", "it's not your fault".
- **Owning it:** "I made a mistake" is not agentless; "I hurt you" is not a deflection.

### One card per phrase

When two rules match the same words, **red beats normal, then the longer match wins**, so a phrase never shows two cards.

### Message-level hints

Some things can't be judged from a phrase. [`hints.ts`](src/checker/hints.ts) uses the same word-distance matching to notice cues like "she said she needs some distance" and shows a gentle question under the box. They are shown at most two at a time.

---

## Decisions, and why

**1. Rules, not AI.** Every flag comes from a visible rule you can read and change. That makes it explainable ("why did it flag this?" has an exact answer), deterministic, free, offline, and private. It also keeps the words yours, which is the whole point. The app never generates, rewrites, or suggests apology text.

**2. Questions, not verdicts.** Flags use "This may…" and "Does this…?", never "wrong" or "you can't say that". Context is invisible to a keyword checker, and the writer knows their situation best. A question invites reflection, and a verdict invites arguing with the app.

**3. Never block the user.** Flags inform; they never disable copying. A tool that blocks people when they're already upset gets closed or ignored.

**4. Only three checklist items gate "Continue".** *What I did / how it affected them / what I'll do differently* maps to the components of an effective apology in the research (acknowledge, show you understand the harm, offer repair). It nudges toward those without judging the writing.

**5. From exact phrases to word distance.** The first version matched exact phrases and failed the moment someone reworded: "it's your fault" worked, "you really push my buttons" didn't. Matching a few key words within a window catches the wording people actually use. The trade-off is more false alarms, which is deliberate (see next point).

**6. Prefer a false alarm over a miss.** A wrong warning costs one tap on "Ignore". A missed warning lets the writer believe a backfiring apology is fine. Windows lean wide, and guards remove the most common harmless cases.

**7. Two levels, with a conservative red.** Red is reserved for patterns with named expert backing or that are plainly not apologies. Everything thinner is normal-level, so the app doesn't cry wolf on its weakest rules. Denying intent ("I didn't mean to") is normal-level because it is often true, just incomplete; "you know I didn't mean that" is red because it asks the other person to accept your intent.

**8. Starter templates are checked by the same rules.** Templates are fill-in-the-blank so the words stay the writer's. They are tested to **not trigger flags on themselves**. Several early drafts did ("I didn't mean to hurt you", "because I'm embarrassed…") and were reworded.

**9. Debounce, no storage.** Checking runs ~300ms after typing stops. Nothing is stored anywhere (no localStorage, cookies, or backend). Refresh clears everything, including which flags you ignored.

**10. Self-host the wordmark font.** The "Sorry, Properly" logo uses Dancing Script, subset to basic Latin (15 KB), preloaded, with `font-display: swap`. No third-party request is made for it.

**11. Design tokens.** Colors, type, radii, and sizes live in [`tokens.css`](src/styles/tokens.css) (the "Low Tide" palette). The UI can be restyled without touching behavior. Text pairs are chosen to meet WCAG AA contrast.

**12. Scope discipline.** This began as a one-hour internship assignment. Out of scope on purpose: AI rewrites, sentiment analysis, saving drafts, sharing links, accounts, multiple languages, themes, analytics.

---

## Limitations

These are real, and worth knowing before you trust a green screen.

**It matches words, not meaning.**
- A phrasing whose words aren't in the lexicon, slang, typos, or an unusual word order can slip through. "No flags" does **not** mean "good apology".
- It can't follow context: sarcasm, who is speaking, or who "they" refers to.
- Word groups and windows were tuned by hand on the author's examples, **not on a corpus of real apologies**. No false-positive or false-negative rate has been measured.

**It leans towards false alarms.** Sincere sentences sometimes get a normal-level card ("I was stressed, but that is mine to handle" gets a "worth a second look" on the "but"). That is the chosen trade-off, but it can feel noisy.

**It can't see the situation.** It doesn't know the relationship, whether the other person asked for space, the power dynamics between you, or cultural expectations. Warnings about space, public apologies, group "we", and legal wording are generic questions triggered by cue words, not judgments. **It is not for abuse or safety situations, and it is not legal advice.** Over-apologizing in an unequal relationship can't be detected from text at all.

**English only, with US-leaning norms.** Apology conventions differ across cultures, and words like "sumimasen" don't map onto English rules. The footer says it is tuned for English.

**The evidence is thin.** See the next section. Most support is practitioner and expert opinion, much of it read through secondary summaries. No study tests keyword rules like these, and many of the newer patterns rest on reasoning, not findings. "Sorry" repeated many times is flagged on judgment: the one peer-reviewed study found frequent apologizers seen as *warmer*.

**Smaller technical limits.**
- The quote guard handles double quotes only (`"…"` and `“…”`).
- Sentence splitting is simple: abbreviations, ellipses, and missing punctuation can change which words count as "the same sentence".
- Ignored flags are keyed by rule + text + position, so editing earlier text can bring them back.
- Two rules use regex lookbehind, supported in current browsers (Safari 16.4+).
- Flags show as cards under the box. Inline highlighting would need a mirrored backdrop behind the textarea and is not built.
- The checker grew well past the original "~300 lines of JS" goal (about 1,100 lines across `src/checker/`, mostly regex and rule data) by choice.

---

## What the checker is based on

The research is in [`reports/Apology backfire phrases catalog.md`](reports) with its notes in [`research_notes/`](research_notes). Honest summary:

**Reasonably supported (expert or study backing):**
- **Acknowledging responsibility** is the strongest part of an apology, and **asking for forgiveness** is the weakest (Lewicki, Polin & Lount, 2016, read via summaries).
- A **full apology that admits fault** helps settlements, a sympathy-only one doesn't (Robbennolt, 2003).
- "**Sorry you feel…**", "**sorry if…**", and "**sorry, but…**" are repeatedly named as apology-cancelling patterns (Harriet Lerner; commentary on Aaron Lazare's *On Apology*).
- "**Mistakes were made**" is the classic agentless non-apology.
- "**You know I didn't mean that**" is listed as a fake apology that tries to talk you out of your reaction (Psych Central). Practitioner sources broadly agree that defending *intent* leaves the *impact* unaddressed.

**Weaker or inferred:** relitigating, "to be fair", reciprocity, "let's move on", fake gratitude, backhanded ownership, absolute promises, and most situation hints. These are marked normal-level for that reason.

**Not found:** sources for several names that came up in early research (for example Kaulbach, Hargie), and no study of how question-style warnings change behavior.

If you rely on a specific claim, check the source. The research notes list what was read in full versus through search summaries.

---

## Hard rules and non-goals

From [`CLAUDE.md`](CLAUDE.md) and [`SPEC.md`](SPEC.md):

- **No AI in the product.** It never generates, rewrites, or suggests apology text.
- **No network calls, no storage.** No fetch, analytics, localStorage, sessionStorage, or IndexedDB.
- **No backend, accounts, or database.**
- **Never block the user.** Flags don't disable copying.
- **Flag copy is a question, not a verdict.**
- **Not for abuse or safety situations.**

---

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server. |
| `npm test` | Run the unit tests (vitest). |
| `npm run test:e2e` | Run the Playwright screen checks at 375px (mobile) and 1280px (desktop). |
| `npm run build` | Typecheck and build to `dist/`. |
| `npm run preview` | Serve the production build locally. |

**Deploying:** it's a static site, so deploy `dist/` anywhere (GitHub Pages, Netlify). If you host under a subpath, set Vite's `base` so the font and assets resolve.

---

## Project layout

```
src/
  checker/            pure TypeScript, no DOM
    types.ts          Rule, Flag, SeqSpec, NearSpec
    rules.ts          idiom rules (regex) and shared guards
    concepts.ts       word-distance rules (near / seq)
    lexicon.ts        word groups: @sorry, @you, @reaction, @harm...
    near.ts           tokenizer + the near/seq matchers
    check.ts          runs all rules, applies guards, picks one card per phrase
    hints.ts          message-level hints and situation cues
    checker.test.ts   the SPEC cases + ~250 rule and edge-case tests
  components/         React UI (header, brand, editor, flag cards, overlays)
  hooks/              useFlags, useDebouncedValue, useOverlay
  data/templates.ts   6 feelings x 5 fill-in-the-blank starters
  styles/             tokens.css (design tokens), app.css
public/fonts/         self-hosted wordmark font + its OFL license
e2e/                  Playwright screen checks
SPEC.md               source of truth for behavior
CLAUDE.md             guidance for AI coding assistants working in the repo
reports/, research_notes/   the apology-research behind the rules
```

Stack: Vite, React 18, TypeScript. No other runtime dependencies (no UI library, state library, or router).

---

## Changing or adding a rule

1. **Add a synonym** to a group in [`lexicon.ts`](src/checker/lexicon.ts). It applies everywhere that group is used.
2. **Add a rule** to [`concepts.ts`](src/checker/concepts.ts). Pick the 2–3 words that carry the meaning, then a window:
   ```ts
   { id: 'denial', strength: 'strong',
     near: [['fault','blame','responsible'], ['not','no','never'], ['my','me','i']],
     within: 5,
     question: 'Saying it is not your fault can sound like you are not owning your part. Is there a part that is yours?' }
   ```
   Use `near` when order varies, `seq` when order matters.
3. **Tune it:** raise `within`/`gap` to catch more (more false alarms), lower to catch less. Add `unless`/`stop`/`skipBefore`/`skipAfter` for harmless cases.
4. **Change a level** by editing `strength`: `'strong'` (red) or `'weak'` (normal).
5. **Add tests** in [`checker.test.ts`](src/checker/checker.test.ts): one phrase that should flag, and one similar sentence that should stay clean.

The ten test cases in `SPEC.md` are the acceptance tests. If a rule change breaks one, fix the rule, not the test, unless the test is wrong. The tests also check that the **starter templates and several sincere apologies produce no flags**, so a new rule that makes the app flag its own templates will fail the suite.

---

## Accessibility, privacy, and design

- **Mobile-first:** works at 375px, with tap targets of at least 44px and a 16px+ textarea (so iOS doesn't zoom).
- **Accessible basics:** labelled inputs, real `<button>`s, overlays use `role="dialog"` and `aria-modal="true"`, and focus returns to the textarea when an overlay closes. Overlays close with X, Back, Escape, or a backdrop click.
- **Privacy:** nothing you type leaves the page. There is no analytics, no storage, and no server. The wordmark font is self-hosted.
- **Wordmark:** "Sorry, Properly" is real text (not an image), so it stays sharp and readable by screen readers. It's set in Dancing Script (SIL Open Font License, included).

---

## Known issues and next steps

- **Third-party fonts:** the UI fonts (Hanken Grotesk, Literata) are still loaded from Google Fonts. That is a third-party request and sits against the "no network calls" rule. Self-hosting them, like the wordmark font, would fix it.
- **Real-world tuning:** collect real apologies from testers, find the phrases that slip through (and the sincere ones that get flagged), and turn them into lexicon words, rules, and tests. This is the most valuable next step.
- **Inline highlighting:** underline flagged phrases in the box (solid for red, dotted for normal) using the backdrop-mirror technique.
- **Smaller rule set:** if the code size matters more than coverage, the weakest-evidence rules (fake gratitude, backhanded ownership, counter-accusation, absolute promises, reciprocity) are one block each and easy to delete.
- **Language support:** the lexicon and rules are English-only. Other languages would need their own groups and a different tokenizer.

---

*Fonts: Dancing Script, © The Dancing Script Project Authors, SIL Open Font License 1.1 (see `public/fonts/OFL-DancingScript.txt`).*
