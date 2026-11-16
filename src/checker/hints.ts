const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

// Situations a phrase rule can't judge: shown as gentle questions under the box.
const situations: { pattern: RegExp; question: string }[] = [
  {
    pattern:
      /\b(?:said|asked|told\s+me|wants?)\b[^.!?]{0,30}\b(?:space|time\s+alone|time\s+to\s+(?:think|cool)|to\s+be\s+left\s+alone|not\s+to\s+(?:contact|text|call|message))\b|\bneeds?\s+(?:some\s+|their\s+|my\s+)?(?:space|time)\b|\bno\s+contact\b|\bleave\s+me\s+alone\b|\bstop\s+(?:texting|calling|messaging|contacting)\s+me\b|\b(?:blocked|ignored)\s+(?:me|you)\b|\bdon['’]t\s+want\s+to\s+(?:hear\s+from|talk\s+to|speak\s+to|see)\s+me\b|\bwant\s+nothing\s+to\s+do\s+with\s+me\b/i,
    question: 'They asked for space. Is sending this now what they asked for?',
  },
  {
    pattern:
      /\b(?:it['’]s\s+)?all\s+my\s+fault\b|\bmy\s+fault\s+entirely\b|\bi\s+(?:accept|take)\s+all\s+the\s+blame\b|\bi['’]m\s+to\s+blame\s+for\s+everything\b|\bi\s+blame\s+myself\b|\bsorry\s+for\s+being\s+(?:too\s+)?(?:sensitive|emotional|dramatic|needy|annoying|difficult)\b|\bplease\s+don['’]t\s+(?:be\s+(?:mad|angry|upset)|hate\s+me|leave(?:\s+me)?)\b|\bi\s+always\s+(?:mess\s+up|ruin)\b/i,
    question: 'Is all of this yours to own? It may be fine to apologize only for the part that was.',
  },
  {
    pattern:
      /\bpublicly\b|\bpublic\s+apology\b|\bin\s+front\s+of\s+(?:everyone|everybody|the\s+(?:team|group|class))\b|\bgroup\s+chat\b|\b(?:social\s+media|facebook|instagram|twitter|tiktok|linkedin|reddit|team\s+channel|reply[\s-]all)\b|\b(?:post|posting|tweet|tweeting)\b|#\w+/i,
    question: 'Was the harm public or private? A public apology for a private matter may expose the other person.',
  },
  {
    pattern:
      /\bwe(?:['’]re|\s+are)\s+(?:so\s+|very\s+|truly\s+|deeply\s+)?sorry\b|\bwe\s+(?:deeply\s+|sincerely\s+)?apologi[sz]e\b|\bour\s+(?:deepest\s+)?apologies\b|\bon\s+behalf\s+of\s+(?:the\s+team|everyone|us|all|my\s+(?:family|team|company))\b|\bthe\s+(?:team|company)\s+(?:is|are)\s+sorry\b/i,
    question: 'Who is "we"? Did everyone agree, and does the person hurt hear from someone who owns it?',
  },
  {
    pattern:
      /\b(?:liable|liability|lawsuit|sue[ds]?|suing|legal(?:ly)?|insurance|negligen\w*|attorney|lawyer|court|damages|compensation|settlement|police|disciplinary|human\s+resources|hr|admit(?:ting)?\s+(?:fault|liability))\b/i,
    question: 'Could there be legal or insurance consequences? A lawyer or HR can say whether this wording is okay.',
  },
]

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
  for (const s of situations) if (s.pattern.test(text)) hints.push(s.question)
  return hints
}
