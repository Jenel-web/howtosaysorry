import { useState } from 'react'
import { Overlay } from './Overlay'

export function PauseOverlay({ text, onClose }: { text: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Overlay title="Read it out loud first." onClose={onClose}>
      <ul className="hints">
        <li>Has the other person had time to cool off?</li>
        <li>Did they ask for space? Is this what they asked for?</li>
      </ul>
      <div className="row">
        <button className="primary" onClick={copy}>{copied ? 'Copied' : 'Copy message'}</button>
        <button onClick={onClose}>Back to edit</button>
      </div>
    </Overlay>
  )
}
