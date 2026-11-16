import { useCallback, useRef, useState } from 'react'
import { Brand } from './components/Brand'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ApologyEditor } from './components/ApologyEditor'
import { FlagList } from './components/FlagList'
import { LengthHint } from './components/LengthHint'
import { StarterOverlay, BLANK } from './components/overlays/StarterOverlay'
import { ChecklistOverlay } from './components/overlays/ChecklistOverlay'
import { PauseOverlay } from './components/overlays/PauseOverlay'
import { ClearConfirm } from './components/overlays/ClearConfirm'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { useFlags } from './hooks/useFlags'
import { useOverlay } from './hooks/useOverlay'
import type { Flag } from './checker'

const countWords = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0)

// Nothing here is saved or sent. All state lives in memory and is gone on refresh.
export default function App() {
  const [text, setText] = useState('')
  const debounced = useDebouncedValue(text, 300)
  const { flags, hints, strongCount, ignore, reset } = useFlags(debounced)
  const overlay = useOverlay()
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const flagsRef = useRef<HTMLElement>(null)

  const focusEditor = useCallback(() => {
    requestAnimationFrame(() => editorRef.current?.focus())
  }, [])
  const closeOverlay = useCallback(() => {
    overlay.close()
    focusEditor()
  }, [overlay, focusEditor])

  const showInText = (flag: Flag) => {
    const el = editorRef.current
    if (!el) return
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    el.focus()
    el.setSelectionRange(flag.start, flag.start)
    el.blur()
    el.focus()
    el.setSelectionRange(flag.start, flag.end)
  }

  const insertTemplate = (template: string, mode: 'replace' | 'append') => {
    const appending = mode === 'append' && text.trim()
    const next = appending ? `${text.replace(/\s+$/, '')}\n\n${template}` : template
    setText(next)
    overlay.close()
    const offset = appending ? next.length - template.length : 0
    const blankAt = template.indexOf(BLANK)
    requestAnimationFrame(() => {
      const el = editorRef.current
      if (!el) return
      el.focus()
      if (blankAt >= 0) el.setSelectionRange(offset + blankAt, offset + blankAt + BLANK.length)
      else el.setSelectionRange(offset, offset)
    })
  }

  const reviewFlags = () => {
    overlay.close()
    requestAnimationFrame(() => {
      const section = flagsRef.current
      if (!section) return
      section.scrollIntoView({ block: 'start', behavior: 'smooth' })
      section.querySelector('button')?.focus({ preventScroll: true })
    })
  }

  const clearText = () => {
    setText('')
    reset()
    closeOverlay()
  }

  return (
    <div className="page">
      <Brand />
      <main className="main">
        <Header onStart={() => overlay.show('starter')} />

        <div className="writing">
          <ApologyEditor
            ref={editorRef}
            value={text}
            onChange={setText}
            wordCount={countWords(text)}
            onClear={() => overlay.show('clear')}
          />
          <LengthHint hints={hints} />
        </div>

        <FlagList ref={flagsRef} flags={flags} onIgnore={ignore} onShow={showInText} />

        <section className="actions">
          <button
            type="button"
            className="btn btn--primary actions__send"
            disabled={!text.trim()}
            onClick={() => overlay.show('checklist')}
          >
            Ready to send?
          </button>
          <p className="muted small actions__help">We'll do a quick check before you copy.</p>
        </section>

        <Footer />
      </main>

      {overlay.open === 'starter' && (
        <StarterOverlay hasText={text.trim().length > 0} onInsert={insertTemplate} onClose={closeOverlay} />
      )}
      {overlay.open === 'checklist' && (
        <ChecklistOverlay
          strongCount={strongCount}
          onReview={reviewFlags}
          onContinue={() => overlay.show('pause')}
          onClose={closeOverlay}
        />
      )}
      {overlay.open === 'pause' && <PauseOverlay message={text} onClose={closeOverlay} />}
      {overlay.open === 'clear' && <ClearConfirm onConfirm={clearText} onClose={closeOverlay} />}
    </div>
  )
}
