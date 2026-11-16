import { useState } from 'react'
import { Overlay } from './Overlay'

const items = ['I said what I did', 'I said how it affected them', "I said what I'll do differently"]

type Props = { strongCount: number; onReview: () => void; onContinue: () => void; onClose: () => void }

export function ChecklistOverlay({ strongCount, onReview, onContinue, onClose }: Props) {
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false))
  const all = checked.every(Boolean)

  return (
    <Overlay title="Ready to send?" onClose={onClose}>
      {strongCount > 0 && (
        <div className="notice">
          <p>{strongCount} {strongCount === 1 ? 'phrase' : 'phrases'} may cause trouble.</p>
          <button onClick={onReview}>Review</button>
        </div>
      )}
      {items.map((label, i) => (
        <label key={label} className="check">
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
          />
          {label}
        </label>
      ))}
      <div className="row">
        <button onClick={onClose}>Back</button>
        <button className="primary" disabled={!all} onClick={onContinue}>Continue</button>
      </div>
    </Overlay>
  )
}
