import { rules } from './rules'
import type { Flag } from './types'

const overlaps = (a: Flag, b: Flag) => a.start < b.end && b.start < a.end

// Text inside "quotes" is being quoted, not said by the writer.
function inQuotes(text: string, index: number) {
  const before = text.slice(0, index)
  const straight = (before.match(/"/g) ?? []).length % 2 === 1
  const curly = (before.match(/“/g) ?? []).length > (before.match(/”/g) ?? []).length
  return straight || curly
}

const sentenceBefore = (text: string, index: number) => text.slice(0, index).split(/[.!?\n]/).pop() ?? ''

export function check(text: string): Flag[] {
  const all: Flag[] = []
  for (const rule of rules) {
    for (const m of text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))) {
      const start = m.index ?? 0
      const end = start + m[0].length
      if (inQuotes(text, start)) continue
      if (rule.skipBefore?.test(sentenceBefore(text, start))) continue
      if (rule.skipAfter?.test(text.slice(end))) continue
      all.push({
        ruleId: rule.id,
        strength: rule.strength,
        start,
        end,
        match: m[0],
        question: rule.question,
        ignored: false,
      })
    }
  }
  // One card per phrase: strong beats weak, then the longer match wins.
  const ranked = [...all].sort((a, b) => Number(b.strength === 'strong') - Number(a.strength === 'strong') || b.end - b.start - (a.end - a.start))
  const kept: Flag[] = []
  for (const f of ranked) if (!kept.some((k) => overlaps(k, f))) kept.push(f)
  return kept.sort((a, b) => a.start - b.start)
}
