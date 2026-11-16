import { useMemo, useState } from 'react'
import { check, messageHints } from '../checker'
import type { Flag } from '../checker'

export const flagKey = (f: Flag) => `${f.ruleId}|${f.match}|${f.start}`

export function useFlags(debouncedText: string) {
  const [ignored, setIgnored] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set()) // "Got it"

  const flags = useMemo(
    () => check(debouncedText).map((f) => ({ ...f, ignored: ignored.has(flagKey(f)) })),
    [debouncedText, ignored],
  )
  const hints = useMemo(() => messageHints(debouncedText), [debouncedText])
  const visible = flags.filter((f) => !f.ignored)
  const strongCount = visible.filter((f) => f.strength === 'strong').length

  return {
    flags: visible,
    hints,
    strongCount,
    isDismissed: (f: Flag) => dismissed.has(flagKey(f)),
    ignore: (f: Flag) => setIgnored((s) => new Set(s).add(flagKey(f))),
    gotIt: (f: Flag) => setDismissed((s) => new Set(s).add(flagKey(f))),
  }
}
