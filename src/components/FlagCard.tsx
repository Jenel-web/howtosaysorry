import type { Flag } from '../checker'

const LABELS = { strong: 'Worth a look', weak: 'Small thing' }

export function trimPhrase(text: string, max = 40) {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + '…'
}

type Props = { flag: Flag; onIgnore: () => void; onShow: () => void }

export function FlagCard({ flag, onIgnore, onShow }: Props) {
  return (
    <article className={`flag flag--${flag.strength}`}>
      <div className="flag__label">
        <span className="flag__marker" aria-hidden="true" />
        {LABELS[flag.strength]}
      </div>
      <p className="flag__phrase">
        <span className="flag__quote">“{trimPhrase(flag.match)}”</span>
      </p>
      <p className="flag__question">{flag.question}</p>
      <div className="flag__actions">
        <button type="button" className="text-btn text-btn--small" onClick={onShow}>
          Show in text
        </button>
        <button type="button" className="text-btn text-btn--small" onClick={onIgnore}>
          Ignore
        </button>
      </div>
    </article>
  )
}
