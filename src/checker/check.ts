import { rules } from './rules'
import type { Flag } from './types'

const overlaps = (a: Flag, b: Flag) => a.start < b.end && b.start < a.end

export function check(text: string): Flag[] {
  const all: Flag[] = []
  for (const rule of rules) {
    for (const m of text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))) {
      const start = m.index ?? 0
      all.push({
        ruleId: rule.id,
        strength: rule.strength,
        start,
        end: start + m[0].length,
        match: m[0],
        question: rule.question,
        ignored: false,
      })
    }
  }
  // Strong beats weak on overlap (e.g. sorry_but swallows its own "but").
  const strong = all.filter((f) => f.strength === 'strong')
  const kept = all.filter((f) => f.strength === 'strong' || !strong.some((s) => overlaps(s, f)))
  return kept.sort((a, b) => a.start - b.start)
}
