import { conceptRules } from './concepts'
import { compileNear, compileSeq, findNear, findSeq, tokenize, type Compiled, type NearCompiled } from './near'
import { rules } from './rules'
import type { Flag, Rule } from './types'

const allRules: Rule[] = [...rules, ...conceptRules]
const seqCache = new Map<Rule, Compiled>()
const nearCache = new Map<Rule, NearCompiled>()
const seqOf = (r: Rule) => {
  let c = seqCache.get(r)
  if (!c) seqCache.set(r, (c = compileSeq({ seq: r.seq!, gap: r.gap, stop: r.stop, also: r.also, crossSentence: r.crossSentence })))
  return c
}
const nearOf = (r: Rule) => {
  let c = nearCache.get(r)
  if (!c) nearCache.set(r, (c = compileNear({ near: r.near!, within: r.within, unless: r.unless, also: r.also, crossSentence: r.crossSentence })))
  return c
}

const overlaps = (a: Flag, b: Flag) => a.start < b.end && b.start < a.end

// Text inside "quotes" is being quoted, not said by the writer.
function inQuotes(text: string, index: number) {
  const before = text.slice(0, index)
  const straight = (before.match(/"/g) ?? []).length % 2 === 1
  const curly = (before.match(/“/g) ?? []).length > (before.match(/”/g) ?? []).length
  return straight || curly
}

const sentenceBefore = (text: string, index: number) => text.slice(0, index).split(/[.!?\n]/).pop() ?? ''

// Every [start, end] a rule matches: exact idioms by regex, ideas by word distance.
function spans(rule: Rule, text: string, tokens: ReturnType<typeof tokenize>): [number, number][] {
  const out: [number, number][] = []
  if (rule.pattern) {
    for (const m of text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))) {
      out.push([m.index ?? 0, (m.index ?? 0) + m[0].length])
    }
  }
  if (rule.seq) for (const [a, b] of findSeq(seqOf(rule), tokens)) out.push([tokens[a].start, tokens[b].end])
  if (rule.near) for (const [a, b] of findNear(nearOf(rule), tokens)) out.push([tokens[a].start, tokens[b].end])
  return out
}

export function check(text: string): Flag[] {
  const tokens = tokenize(text)
  const all: Flag[] = []
  for (const rule of allRules) {
    for (const [start, end] of spans(rule, text, tokens)) {
      if (inQuotes(text, start)) continue
      if (rule.skipBefore?.test(sentenceBefore(text, start))) continue
      if (rule.skipAfter?.test(text.slice(end))) continue
      all.push({
        ruleId: rule.id,
        strength: rule.strength,
        start,
        end,
        match: text.slice(start, end),
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
