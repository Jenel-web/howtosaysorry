import { useMemo, useState } from 'react'
import { check, messageHints } from '../checker'
import type { Flag } from '../checker'

// Ignored flags are keyed by rule + matched text + position (SPEC: may reappear if text around it changes).
export const flagKey = (f: Flag) => `${f.ruleId}|${f.match}|${f.start}`

const STRENGTH_ORDER = { strong: 0, weak: 1 }

export function useFlags(debouncedText: string) {
  const [ignored, setIgnored] = useState<Set<string>>(new Set())

  const flags = useMemo(
    () =>
      check(debouncedText)
        .filter((f) => !ignored.has(flagKey(f)))
        .sort((a, b) => STRENGTH_ORDER[a.strength] - STRENGTH_ORDER[b.strength] || a.start - b.start),
    [debouncedText, ignored],
  )
  const hints = useMemo(() => messageHints(debouncedText).slice(0, 2), [debouncedText])
  const strongCount = flags.filter((f) => f.strength === 'strong').length

  return {
    flags,
    hints,
    strongCount,
    ignore: (f: Flag) => setIgnored((s) => new Set(s).add(flagKey(f))),
    reset: () => setIgnored(new Set()),
  }
}
