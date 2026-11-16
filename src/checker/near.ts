// Word-distance matcher: "these words, in this order, each within N words of the last".
// Pure functions, no DOM. Lets one rule catch many different wordings.
import { LEX } from './lexicon'
import type { NearSpec, SeqSpec, Term } from './types'

export type Tok = { w: string; start: number; end: number; sent: number }
type Test = (w: string) => boolean
export type Compiled = { terms: Test[]; gap: number; stop?: Test; also: Test[]; cross: boolean }

// "can't" -> can + not, "you're" -> you + are, "I'll" -> i + will, so rules see plain words.
function expand(raw: string): string[] {
  const w = raw.toLowerCase().replace(/’/g, "'")
  if (!w.includes("'")) return [w.replace(/-/g, '')]
  if (w === "can't") return ['can', 'not']
  if (w === "won't") return ['will', 'not']
  if (w.endsWith("n't")) return [w.slice(0, -3), 'not']
  const [base, tail] = [w.slice(0, w.indexOf("'")), w.slice(w.indexOf("'") + 1)]
  const extra: Record<string, string> = { re: 'are', m: 'am', ve: 'have', ll: 'will', d: 'would' }
  return tail in extra ? [base, extra[tail]] : [base]
}

export function tokenize(text: string): Tok[] {
  const out: Tok[] = []
  let sent = 0
  let prevEnd = 0
  for (const m of text.matchAll(/[a-z]+(?:['’-][a-z]+)*/gi)) {
    const start = m.index ?? 0
    if (/[.!?\n]/.test(text.slice(prevEnd, start))) sent++
    prevEnd = start + m[0].length
    for (const w of expand(m[0])) out.push({ w, start, end: prevEnd, sent })
  }
  return out
}

function wordTest(t: string): Test {
  if (t.startsWith('@')) {
    const tests = (LEX[t.slice(1)] ?? []).map(wordTest)
    return (w) => tests.some((f) => f(w))
  }
  if (t.endsWith('*')) return (w) => w.startsWith(t.slice(0, -1))
  return (w) => w === t
}

const compileTerm = (t: Term): Test => {
  const tests = (Array.isArray(t) ? t : [t]).map(wordTest)
  return (w) => tests.some((f) => f(w))
}

export const compileSeq = (s: SeqSpec): Compiled => ({
  terms: s.seq.map(compileTerm),
  gap: s.gap ?? 3,
  stop: s.stop === undefined ? undefined : compileTerm(s.stop),
  also: (s.also ?? []).map(compileTerm),
  cross: !!s.crossSentence,
})

export type NearCompiled = { terms: Test[]; within: number; unless?: Test; also: Test[]; cross: boolean }

export const compileNear = (s: NearSpec): NearCompiled => ({
  terms: s.near.map(compileTerm),
  within: s.within ?? 5,
  unless: s.unless === undefined ? undefined : compileTerm(s.unless),
  also: (s.also ?? []).map(compileTerm),
  cross: !!s.crossSentence,
})

// Key words in ANY order, all inside a window of `within` words.
// Returns [firstTokenIndex, lastTokenIndex] for every window that holds all of them.
export function findNear(c: NearCompiled, toks: Tok[]): [number, number][] {
  const found: [number, number][] = []
  for (let s = 0; s < toks.length; s++) {
    if (!c.terms.some((t) => t(toks[s].w))) continue // a window starts on a key word
    const end = Math.min(toks.length - 1, s + c.within - 1)
    const used = new Set<number>()
    let last = s
    let ok = true
    for (const term of c.terms) {
      let hit = -1
      for (let j = s; j <= end; j++) {
        if (!c.cross && toks[j].sent !== toks[s].sent) break
        if (!used.has(j) && term(toks[j].w)) {
          hit = j
          break
        }
      }
      if (hit < 0) {
        ok = false
        break
      }
      used.add(hit)
      last = Math.max(last, hit)
    }
    if (!ok || !used.has(s)) continue
    const sentence = toks.filter((t) => t.sent === toks[s].sent)
    if (c.unless) {
      const from = Math.max(0, s - 4)
      if (toks.slice(from, last + 1).some((t) => t.sent === toks[s].sent && c.unless!(t.w))) continue
    }
    if (c.also.every((t) => sentence.some((x) => t(x.w)))) found.push([s, last])
  }
  return found
}

// Returns [firstTokenIndex, lastTokenIndex] for every place the sequence occurs.
export function findSeq(c: Compiled, toks: Tok[]): [number, number][] {
  // From token i (which matched term k-1), find the rest of the chain.
  const walk = (i: number, k: number): number => {
    if (k === c.terms.length) return i
    for (let j = i + 1; j < toks.length && j - i - 1 <= c.gap; j++) {
      if (!c.cross && toks[j].sent !== toks[i].sent) return -1
      if (c.terms[k](toks[j].w)) {
        const last = walk(j, k + 1)
        if (last >= 0) return last
      }
      if (c.stop?.(toks[j].w)) return -1
      // Another copy of the first word starts its own, closer match: don't reach over it.
      if (c.terms[0](toks[j].w)) return -1
    }
    return -1
  }
  const found: [number, number][] = []
  for (let s = 0; s < toks.length; s++) {
    if (!c.terms[0](toks[s].w)) continue
    const last = walk(s, 1)
    if (last < 0) continue
    const sameSentence = toks.filter((t) => t.sent === toks[s].sent)
    if (c.also.every((t) => sameSentence.some((x) => t(x.w)))) found.push([s, last])
  }
  return found
}
