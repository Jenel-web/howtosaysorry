import { forwardRef } from 'react'
import type { Flag } from '../checker'

type Props = { flag: Flag; onIgnore: () => void; onGotIt: () => void; dismissed: boolean }

export const FlagCard = forwardRef<HTMLLIElement, Props>(function FlagCard(
  { flag, onIgnore, onGotIt, dismissed },
  ref,
) {
  return (
    <li ref={ref} tabIndex={-1} className={`card ${flag.strength}${dismissed ? ' dismissed' : ''}`}>
      <q>{flag.match}</q>
      <p>{flag.question}</p>
      <div className="row">
        <button onClick={onGotIt}>Got it</button>
        <button onClick={onIgnore}>Ignore</button>
      </div>
    </li>
  )
})
