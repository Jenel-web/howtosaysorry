import { Fragment, useState } from 'react'
import { feelings, templates, type Feeling } from '../../data/templates'
import { CheckIcon } from '../Icons'
import { Overlay } from './Overlay'

export const BLANK = '___'

type Props = {
  hasText: boolean
  onInsert: (template: string, mode: 'replace' | 'append') => void
  onClose: () => void
}

function TemplateText({ text }: { text: string }) {
  const parts = text.split(BLANK)
  return (
    <p className="template__text">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <span className="template__blank" aria-label="blank" />}
        </Fragment>
      ))}
    </p>
  )
}

export function StarterOverlay({ hasText, onInsert, onClose }: Props) {
  const [picked, setPicked] = useState<Feeling | null>(null)
  const [index, setIndex] = useState(0)
  const [confirming, setConfirming] = useState(false)

  const options = picked ? templates[picked] : []
  const template = options[index % (options.length || 1)]

  const useThis = () => {
    if (!template) return
    if (hasText) setConfirming(true)
    else onInsert(template, 'replace')
  }

  return (
    <Overlay
      title="Need a place to start?"
      description="Pick what you're feeling. You'll get a few blanks to fill in with your own words."
      onClose={onClose}
    >
      <div className="chips" role="group" aria-label="How you're feeling">
        {feelings.map((f) => {
          const on = f === picked
          return (
            <button
              key={f}
              type="button"
              className={`chip${on ? ' chip--on' : ''}`}
              aria-pressed={on}
              onClick={() => {
                setPicked(f)
                setIndex(0)
                setConfirming(false)
              }}
            >
              {on && <CheckIcon size={16} strokeWidth={2.4} />}
              {f}
            </button>
          )
        })}
      </div>

      {template ? (
        <div className="template">
          <div className="template__card">
            <TemplateText text={template} />
          </div>
          <div className="template__foot">
            <p className="muted small template__help">Fill the blanks with what's true for you.</p>
            {options.length > 1 && (
              <button
                type="button"
                className="text-btn text-btn--small"
                onClick={() => {
                  setIndex((i) => (i + 1) % options.length)
                  setConfirming(false)
                }}
              >
                Show another
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="template-empty">Pick a feeling above to see a starting point.</div>
      )}

      {confirming && template ? (
        <div className="choice" role="group" aria-labelledby="choice-text">
          <p id="choice-text" className="choice__text">
            You already wrote something.
          </p>
          <div className="choice__buttons">
            <button type="button" className="btn btn--primary" onClick={() => onInsert(template, 'replace')}>
              Replace it
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => onInsert(template, 'append')}>
              Add below it
            </button>
            <button type="button" className="text-btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="stack-buttons">
          <button type="button" className="btn btn--primary btn--block" disabled={!template} onClick={useThis}>
            Use this
          </button>
          <button type="button" className="text-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      )}
    </Overlay>
  )
}
