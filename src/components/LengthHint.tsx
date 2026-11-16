import { InfoIcon } from './Icons'

export function LengthHint({ hints }: { hints: string[] }) {
  if (!hints.length) return null
  return (
    <ul className="hints" aria-live="polite">
      {hints.map((h) => (
        <li key={h} className="hints__item">
          <span className="hints__icon">
            <InfoIcon />
          </span>
          {h}
        </li>
      ))}
    </ul>
  )
}
