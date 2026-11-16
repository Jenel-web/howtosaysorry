import { forwardRef } from 'react'
import type { Flag } from '../checker'
import { FlagCard } from './FlagCard'

type Props = {
  flags: Flag[]
  isDismissed: (f: Flag) => boolean
  onIgnore: (f: Flag) => void
  onGotIt: (f: Flag) => void
}

export const FlagList = forwardRef<HTMLLIElement, Props>(function FlagList(
  { flags, isDismissed, onIgnore, onGotIt },
  firstRef,
) {
  if (!flags.length) return null
  return (
    <ul className="flags" aria-label="Flagged phrases">
      {flags.map((f, i) => (
        <FlagCard
          key={`${f.ruleId}${f.start}`}
          ref={i === 0 ? firstRef : undefined}
          flag={f}
          dismissed={isDismissed(f)}
          onIgnore={() => onIgnore(f)}
          onGotIt={() => onGotIt(f)}
        />
      ))}
    </ul>
  )
})
