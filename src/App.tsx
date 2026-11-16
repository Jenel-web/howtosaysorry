import { useRef, useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ApologyEditor } from './components/ApologyEditor'
import { FlagList } from './components/FlagList'
import { FlagCounter } from './components/FlagCounter'
import { LengthHint } from './components/LengthHint'
import { StarterOverlay } from './components/overlays/StarterOverlay'
import { ChecklistOverlay } from './components/overlays/ChecklistOverlay'
import { PauseOverlay } from './components/overlays/PauseOverlay'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useFlags } from './hooks/useFlags'
import { useOverlay } from './hooks/useOverlay'

export default function App() {
  const [text, setText] = useState('')
  const debounced = useDebouncedValue(text, 300)
  const { flags, hints, strongCount, isDismissed, ignore, gotIt } = useFlags(debounced)
  const overlay = useOverlay()
  const textRef = useRef<HTMLTextAreaElement>(null)
  const firstFlagRef = useRef<HTMLLIElement>(null)

  const close = () => {
    overlay.close()
    textRef.current?.focus()
  }
  const focusFirstFlag = () => firstFlagRef.current?.focus()

  return (
    <main>
      <Header />
      <button onClick={() => overlay.show('starter')}>Need a start?</button>
      <ApologyEditor ref={textRef} value={text} onChange={setText} />
      <FlagCounter count={strongCount} onClick={focusFirstFlag} />
      <LengthHint hints={hints} />
      <FlagList ref={firstFlagRef} flags={flags} isDismissed={isDismissed} onIgnore={ignore} onGotIt={gotIt} />
      <div className="row">
        <button className="primary" disabled={!text.trim()} onClick={() => overlay.show('checklist')}>
          Ready to send?
        </button>
        <button
          disabled={!text}
          onClick={() => {
            if (window.confirm('Clear everything?')) {
              setText('')
              textRef.current?.focus()
            }
          }}
        >
          Clear
        </button>
      </div>
      <Footer />

      {overlay.open === 'starter' && (
        <StarterOverlay
          hasText={!!text.trim()}
          onClose={close}
          onUse={(tpl, mode) => {
            setText(mode === 'replace' ? tpl : `${text}\n\n${tpl}`)
            close()
          }}
        />
      )}
      {overlay.open === 'checklist' && (
        <ChecklistOverlay
          strongCount={strongCount}
          onClose={close}
          onReview={() => {
            overlay.close()
            setTimeout(focusFirstFlag, 0)
          }}
          onContinue={() => overlay.show('pause')}
        />
      )}
      {overlay.open === 'pause' && <PauseOverlay text={text} onClose={close} />}
    </main>
  )
}
