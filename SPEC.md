# Apology Helper — Spec

## Problem
When we're scared, we apologize badly. We add "but," blame the other person's reaction, or tell a long story, and the apology makes the conflict bigger instead of smaller.

## What it is
A single web page where someone writes an apology in their own words. A rule-based checker flags phrases that often backfire, phrased as questions the person can dismiss. Nothing is saved or sent.

## Goals
- Help people catch common apology mistakes before they send.
- Keep the words 100% the user's own.
- Every flag is explainable by a visible rule.

## Non-goals (left out on purpose)
- No AI-generated or AI-rewritten messages
- No accounts, database, backend, or analytics
- No saving text (refresh clears everything)
- No sending messages from the app (user copies and sends themselves)
- No claim that it fixes relationships
- Not for abuse or safety situations

---

## Screen layout

One main screen. Everything else is an overlay on top of it.

### Main screen

| Element | Behavior |
|---|---|
| Header | App name + one line: "Write what you want to say. Nothing is saved or sent." |
| "Need a start?" button | Opens Starter overlay |
| Text box | User writes apology. Checker runs ~300ms after typing stops |
| Highlighted phrases | Flagged text is underlined (strong = solid, weak = dotted). Click/tap opens Flag popover |
| Flag counter | "2 things to look at" (counts unignored strong flags only). Click scrolls/focuses first flag. Hidden when 0 |
| Length hint | Shown below box when too long or too short (see Checker) |
| "Ready to send?" button | Opens Checklist overlay. Always enabled when text is not empty |
| Clear button | Confirms, then empties text box and flags |
| Footer | "Checks common patterns, not meaning. You know your situation best." + "For everyday conflicts, not abuse or safety concerns." |

### Overlay rules
- Only one overlay open at a time.
- Close via X, Back button, Escape key, or clicking the backdrop.
- Closing returns focus to the text box.

### 1. Starter overlay
- Feeling chips: Guilty, Hurt (v1 only needs these two; Ashamed, Angry, Scared are stretch).
- Selecting a chip shows 1–2 templates with `___` blanks.
- "Use this": inserts template into text box.
  - If the box already has text, ask: "Replace what you wrote" / "Add below it".
- X: closes with no change.

Templates (v1):
- Guilty: "I'm sorry for ___. I know it made you feel ___. Next time I'll ___."
- Hurt: "I've been feeling ___ since ___, and I reacted by ___. I'm sorry for that part. I'd like to ___."

### 2. Flag popover (anchored to the flagged phrase, or a card in the flag list)
- Shows the rule's question, e.g. "Does this 'but' explain, or excuse?"
- "Ignore": marks the flag ignored, removes highlight, decrements counter.
- "Got it": closes popover, keeps flag.
- Typing closes the popover.

### 3. Checklist overlay
- If unignored strong flags exist: "2 phrases may cause trouble." + "Review" button (closes overlay, focuses first flag).
- Three checkboxes:
  - I said what I did
  - I said how it affected them
  - I said what I'll do differently
- "Continue": enabled only when all 3 boxes are ticked. Opens Pause overlay. Never blocked by flags.
- "Back": closes overlay.

### 4. Pause overlay
- Text: "Read it out loud first."
- "Copy message": copies text to clipboard, button shows "Copied" for 2s.
  - Stretch: 10s countdown before Copy enables, with "Skip" link.
- "Back to edit": closes overlay.

---

## Checker

Pure function: `check(text) -> Flag[]`. No network calls. Case-insensitive.

### Rules

| id | Strength | Matches (idea) | Question shown |
|---|---|---|---|
| `sorry_but` | strong | "sorry" / "apologize" followed within 5 words by "but" | Does this "but" explain, or excuse? |
| `sorry_you_feel` | strong | "sorry (that) you feel/felt/are/were" | This can sound like the problem is their reaction. Can you name what you did? |
| `if_i_hurt` | strong | "if I hurt/upset/offended" | "If" can sound like you doubt it happened. Can you say that it did? |
| `always_never` | strong | "you always" / "you never" | "Always" and "never" can start a new argument. Is this about this one time? |
| `blame_shift` | strong | "you made me", "because you" | This may shift the blame to them. Is that what you mean? |
| `minimizing` | strong | "overreact(ing)", "too sensitive", "calm down", "just a joke", "not a big deal" | This may make their feelings seem small. |
| `pressure` | weak | "forgive me already", "so we're good", "you have to forgive" | Asking for forgiveness right away can feel like pressure. |
| `loose_but` | weak | any "but" not already caught by `sorry_but` | Worth a second look? |

### Message-level hints (not inline flags)
- No "sorry" / "apologize" / "my fault" anywhere (and text ≥ 15 words): "You haven't said sorry yet. Is that on purpose?"
- More than 150 words: "Long apologies often turn into explanations. Can you get to the main point?"
- Fewer than 8 words (once user has typed something): "This may feel brief. Have you said what you did?"

### Data shapes
```ts
type Strength = "strong" | "weak";

type Rule = {
  id: string;
  strength: Strength;
  pattern: RegExp;      // global, case-insensitive
  question: string;
};

type Flag = {
  ruleId: string;
  strength: Strength;
  start: number;        // index in text
  end: number;
  match: string;
  question: string;
  ignored: boolean;
};
```

### Behavior
- Re-run checker on debounce (300ms).
- Ignored flags persist while the matched text is unchanged (key by `ruleId + match + start`); if the text around it changes, the flag may reappear. Acceptable for v1.
- Overlapping matches: keep the strong one, drop the weak one.

### Highlighting approach
A `<textarea>` can't style parts of its text. Options:
1. **v1 (fastest):** show flags as a list of cards under the text box, each quoting the phrase with Ignore / Got it.
2. **Stretch:** "backdrop" technique: a div behind a transparent textarea mirrors the text with `<mark>` tags at flag positions (same font, padding, wrapping, synced scroll).

Build option 1 first. Do option 2 only if time is left.

---

## Test cases

Run these by hand (or as a tiny test array in code). Expected strong flags listed.

| # | Text | Expected |
|---|---|---|
| 1 | I'm sorry I missed your birthday. I know it hurt you. I'll put it in my calendar from now on. | none |
| 2 | I'm sorry, but you never tell me anything. | `sorry_but`, `always_never` |
| 3 | I'm sorry you feel that way. | `sorry_you_feel` |
| 4 | Sorry if I hurt you. | `if_i_hurt` |
| 5 | I was stressed at work and snapped. I love you, but that's not an excuse. I'm sorry. | `loose_but` (weak only) |
| 6 | You made me so angry that I yelled. Sorry. | `blame_shift` |
| 7 | It was just a joke, you're overreacting. | `minimizing` ×2 + "no sorry" hint |
| 8 | I'm really sorry I lied about where I was. You deserved the truth. I won't do that again. | none |
| 9 | Sorry. | short hint |
| 10 | I apologize for what I said, but honestly you always do this, so we're good now right? | `sorry_but`, `always_never`, `pressure` (weak) |

Goal: good apologies (1, 5, 8) show no strong flags; bad ones show the right flag.

---

## Build order (1 hour)
1. (25 min) Text box + checker + flag list with questions
2. (10 min) Ignore / Got it, flag counter, length + no-sorry hints
3. (10 min) Checklist overlay + Pause overlay + Copy
4. (5 min) Starter overlay with 2 templates (skip if behind)
5. (10 min) Test with the 10 cases, deploy, write the 3–5 sentences

## Done means
- Live link works on phone and desktop
- All 10 test cases behave as expected
- Nothing is stored anywhere (no localStorage, no network calls)
