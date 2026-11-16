import { useState } from 'react'
import { CheckIcon } from '../Icons'
import { Overlay } from './Overlay'

const ITEMS = [
  { id: 'did', label: 'I said what I did', help: 'Name the actual thing, not just “what happened.”' },
  { id: 'affect', label: 'I said how it affected them', help: 'Their feelings, not your reasons.' },
  { id: 'change', label: "I said what I'll do differently", help: 'Something small and real.' },
]

type Props = { strongCount: number; onReview: () => void; onContinue: () => void; onClose: () => void }

export function ChecklistOverlay({ strongCount, onReview, onContinue, onClose }: Props) {
  const [ticked, setTicked] = useState<Record<string, boolean>>({})
  const allTicked = ITEMS.every((i) => ticked[i.id])

  return (
    <Overlay
      title="Before you send"
      description="A good apology usually covers these three things. Tick what's true for your message."
      onClose={onClose}
    >
      {strongCount > 0 && (
        <div className="notice">
          <p className="notice__text">
            <span className="notice__marker" aria-hidden="true" />
            {strongCount} {strongCount === 1 ? 'phrase' : 'phrases'} may cause trouble.
          </p>
          <button type="button" className="notice__btn" onClick={onReview}>
            Review them
          </button>
        </div>
      )}

      <fieldset className="checks">
        <legend className="visually-hidden">What your message covers</legend>
        {ITEMS.map((item) => {
          const on = !!ticked[item.id]
          return (
            <label key={item.id} className="check">
              <input
                type="checkbox"
                className="check__input"
                checked={on}
                onChange={(e) => setTicked((t) => ({ ...t, [item.id]: e.target.checked }))}
              />
              <span className="check__box" aria-hidden="true">
                {on && <CheckIcon size={16} strokeWidth={3} />}
              </span>
              <span className="check__text">
                <span className="check__label">{item.label}</span>
                <span className="check__help">{item.help}</span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <div className="stack-buttons">
        {/* Only the checklist gates Continue. Flags never do. */}
        <button type="button" className="btn btn--primary btn--block" disabled={!allTicked} onClick={onContinue}>
          Continue
        </button>
        <button type="button" className="text-btn" onClick={onClose}>
          Back to my message
        </button>
      </div>
      <p className="muted tiny center">Not sure about one? Go back and add a sentence.</p>
    </Overlay>
  )
}
