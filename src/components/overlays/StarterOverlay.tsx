import { useState } from 'react'
import { feelings, templates, type Feeling } from '../../data/templates'
import { Overlay } from './Overlay'

type Props = { hasText: boolean; onUse: (tpl: string, mode: 'replace' | 'append') => void; onClose: () => void }

export function StarterOverlay({ hasText, onUse, onClose }: Props) {
  const [feeling, setFeeling] = useState<Feeling | null>(null)
  const [pending, setPending] = useState<string | null>(null)

  const use = (tpl: string) => (hasText ? setPending(tpl) : onUse(tpl, 'replace'))

  return (
    <Overlay title="Need a start?" onClose={onClose}>
      <p>How are you feeling?</p>
      <div className="row">
        {feelings.map((f) => (
          <button key={f} aria-pressed={feeling === f} onClick={() => { setFeeling(f); setPending(null) }}>{f}</button>
        ))}
      </div>
      {feeling && !pending &&
        templates[feeling].map((t) => (
          <div key={t} className="template">
            <p>{t}</p>
            <button onClick={() => use(t)}>Use this</button>
          </div>
        ))}
      {pending && (
        <div className="template">
          <p>You already wrote something.</p>
          <div className="row">
            <button onClick={() => onUse(pending, 'replace')}>Replace what you wrote</button>
            <button onClick={() => onUse(pending, 'append')}>Add below it</button>
          </div>
        </div>
      )}
    </Overlay>
  )
}
