const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

// Situations a phrase rule can't judge: shown as gentle questions under the box.
const situations: { pattern: RegExp; question: string }[] = [
  {
    pattern: /\b(?:said|asked|told\s+me)\b[^.!?]{0,30}\b(?:space|time\s+alone|not\s+to\s+(?:contact|text|call))\b|\bneeds?\s+(?:some\s+)?space\b|\bno\s+contact\b|\bdon['’]t\s+want\s+to\s+(?:hear\s+from|talk\s+to|see)\s+me\b/i,
    question: 'They asked for space. Is sending this now what they asked for?',
  },
  {
    pattern: /\bit['’]s\s+all\s+my\s+fault\b|\bsorry\s+for\s+being\s+too\s+sensitive\b|\bplease\s+don['’]t\s+be\s+mad\b/i,
    question: 'Is all of this yours to own? It may be fine to apologize only for the part that was.',
  },
  {
    pattern: /\bpublicly\b|\bgroup\s+chat\b|\bsocial\s+media\b|\b(?:post|posting|tweet|tweeting)\b|#\w+/i,
    question: 'Was the harm public or private? A public apology for a private matter may expose the other person.',
  },
  {
    pattern: /\bwe(?:['’]re|\s+are)\s+(?:so\s+|very\s+)?sorry\b|\bwe\s+apologi[sz]e\b/i,
    question: 'Who is "we"? Did everyone agree, and does the person hurt hear from someone who owns it?',
  },
  {
    pattern: /\b(?:liable|liability|lawsuit|sue|legal|insurance|negligen\w*)\b/i,
    question: 'Could there be legal or insurance consequences? A lawyer or HR can say whether this wording is okay.',
  },
]

export function messageHints(text: string): string[] {
  const words = wordCount(text)
  const hints: string[] = []
  if (words === 0) return hints
  if (words >= 15 && !/\bsorry\b|\bapologi[sz]e\b|\bmy fault\b/i.test(text)) {
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
