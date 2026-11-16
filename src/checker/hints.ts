import { compileSeq, findSeq, tokenize } from './near'
import type { SeqSpec } from './types'

const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

const SORRY = '@sorry'
const FIRST = '@first'

// Situations a phrase rule can't judge: shown as gentle questions under the box.
// Each has exact idioms (pattern) and/or word-distance rules (seqs).
const situations: { question: string; pattern?: RegExp; seqs?: SeqSpec[] }[] = [
  {
    question: 'They asked for space. Is sending this now what they asked for?',
    pattern:
      /\bno\s+contact\b|\bleave\s+me\s+alone\b|\bstop\s+(?:texting|calling|messaging|contacting)\s+me\b|\b(?:blocked|ignored)\s+(?:me|you)\b|\bwant\s+nothing\s+to\s+do\s+with\s+me\b/i,
    seqs: [
      // you said you needed some time alone / she wants distance / they asked for space
      { seq: [['you', 'they', 'she', 'he', 'your', 'their'], ['want*', 'need*', 'asked', 'said', 'told', 'prefer*'], ['space', 'alone', 'distance', 'break', 'time', 'quiet', 'silence']], gap: 4 },
      // doesn't want to hear from me / won't talk to me
      { seq: ['not', ['want', 'wanna', 'willing'], ['hear', 'talk', 'speak', 'see', 'contact', 'text', 'call', 'message'], 'me'], gap: 3 },
    ],
  },
  {
    question: 'Is all of this yours to own? It may be fine to apologize only for the part that was.',
    pattern: /\b(?:it['’]s\s+)?all\s+my\s+fault\b|\bmy\s+fault\s+entirely\b|\bplease\s+don['’]t\s+(?:be\s+(?:mad|angry|upset)|hate\s+me|leave(?:\s+me)?)\b|\bi\s+always\s+(?:mess\s+up|ruin)\b/i,
    seqs: [
      { seq: ['i', ['accept', 'take', 'deserve', 'carry'], ['all', 'every', 'the'], ['blame', 'fault']], gap: 2 },
      { seq: ['i', ['blame', 'hate'], 'myself'], gap: 1 },
      { seq: [SORRY, 'for', 'being', ['sensitive', 'emotional', 'dramatic', 'needy', 'annoying', 'difficult', 'weak']], gap: 2 },
      { seq: ['i', 'am', 'to', 'blame'], gap: 1 },
    ],
  },
  {
    question: 'Was the harm public or private? A public apology for a private matter may expose the other person.',
    pattern:
      /\bpublicly\b|\bpublic\s+apology\b|\bin\s+front\s+of\s+(?:everyone|everybody|the\s+(?:team|group|class))\b|\bgroup\s+chat\b|\b(?:social\s+media|facebook|instagram|twitter|tiktok|linkedin|reddit|team\s+channel|reply[\s-]all)\b|\b(?:post|posting|tweet|tweeting)\b|#\w+/i,
  },
  {
    question: 'Who is "we"? Did everyone agree, and does the person hurt hear from someone who owns it?',
    pattern: /\bour\s+(?:deepest\s+)?apologies\b|\bon\s+behalf\s+of\s+(?:the\s+team|everyone|us|all|my\s+(?:family|team|company))\b|\bthe\s+(?:team|company)\s+(?:is|are)\s+sorry\b/i,
    // we are so sorry / we deeply apologize ("We talked and I'm sorry" is blocked by "i")
    seqs: [{ seq: ['we', SORRY], gap: 3, stop: FIRST }],
  },
  {
    question: 'Could there be legal or insurance consequences? A lawyer or HR can say whether this wording is okay.',
    pattern:
      /\b(?:liable|liability|lawsuit|sue[ds]?|suing|legal(?:ly)?|insurance|negligen\w*|attorney|lawyer|court|damages|compensation|settlement|police|disciplinary|human\s+resources|hr)\b/i,
    seqs: [{ seq: [['admit', 'admitting', 'admitted'], ['fault', 'liability', 'guilt', 'wrongdoing']], gap: 2 }],
  },
]

const compiled = situations.map((s) => ({ ...s, c: (s.seqs ?? []).map(compileSeq) }))

// Words that count as saying sorry, so the "you haven't said sorry yet" hint is fair.
const SAID_SORRY =
  /\bsorry\b|\bapologi[sz](?:e|es|ed|ing)\b|\bapologies\b|\bmy\s+(?:fault|bad|mistake)\b|\bi\s+(?:was\s+wrong|messed\s+up|take\s+(?:full\s+)?responsibility|regret|owe\s+you\s+an\s+apology)\b|\bforgive\s+me\b/i

export function messageHints(text: string): string[] {
  const words = wordCount(text)
  const hints: string[] = []
  if (words === 0) return hints
  if (words >= 15 && !SAID_SORRY.test(text)) {
    hints.push("You haven't said sorry yet. Is that on purpose?")
  }
  if (words > 150) hints.push('Long apologies often turn into explanations. Can you get to the main point?')
  if (words < 8) hints.push('This may feel brief. Have you said what you did?')
  if ((text.match(/\bsorry\b/gi) ?? []).length >= 3) {
    hints.push('Does the message say "sorry" more than once? One clear one may carry more weight.')
  }
  const tokens = tokenize(text)
  for (const s of compiled) {
    if (s.pattern?.test(text) || s.c.some((c) => findSeq(c, tokens).length > 0)) hints.push(s.question)
  }
  return hints
}
