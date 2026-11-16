const wordCount = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

export function messageHints(text: string): string[] {
  const words = wordCount(text)
  const hints: string[] = []
  if (words === 0) return hints
  if (words >= 15 && !/\bsorry\b|\bapologi[sz]e\b|\bmy fault\b/i.test(text)) {
    hints.push("You haven't said sorry yet. Is that on purpose?")
  }
  if (words > 150) hints.push('Long apologies often turn into explanations. Can you get to the main point?')
  if (words < 8) hints.push('This may feel brief. Have you said what you did?')
  return hints
}
