import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from '../Icons'
import { Overlay } from './Overlay'

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

const BARS = [14, 26, 36, 22, 12]

export function PauseOverlay({ message, onClose }: { message: string; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [everCopied, setEverCopied] = useState(false)
  const fallbackRef = useRef<HTMLTextAreaElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (status === 'failed') fallbackRef.current?.select()
  }, [status])

  const handleCopy = async () => {
    if (await copyText(message)) {
      setStatus('copied')
      setEverCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setStatus('idle'), 2000)
    } else {
      setStatus('failed')
    }
  }

  return (
    <Overlay title="One more thing" titleClassName="overlay__title overlay__title--quiet" onClose={onClose}>
      <div className="pause">
        <div className="pause__voice" aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} style={{ height: h }} />
          ))}
        </div>
        <p className="pause__main">Read it out loud first.</p>
        <p className="pause__desc">If it sounds like something you'd say to their face, it's probably ready.</p>
        <ul className="pause__asks">
          <li>Has the other person had time to cool off?</li>
          <li>Did they ask for space? Is this what they asked for?</li>
        </ul>
      </div>

      <div className="stack-buttons">
        <button type="button" className="btn btn--primary btn--block" onClick={handleCopy}>
          {status === 'copied' ? <CheckIcon size={18} /> : <CopyIcon />}
          <span aria-live="polite">{status === 'copied' ? 'Copied' : 'Copy message'}</span>
        </button>

        {status === 'failed' && (
          <div className="fallback">
            <p className="muted small">Couldn't copy automatically. Select the text and copy it yourself.</p>
            <textarea
              ref={fallbackRef}
              className="fallback__box"
              readOnly
              value={message}
              aria-label="Your message, ready to copy"
              onFocus={(e) => e.target.select()}
            />
          </div>
        )}

        {everCopied && status !== 'failed' && (
          <p className="muted small center after-copy">
            Paste it into your chat or message when you're ready. We haven't saved anything.
          </p>
        )}

        <button type="button" className="text-btn" onClick={onClose}>
          Back to edit
        </button>
      </div>
    </Overlay>
  )
}
