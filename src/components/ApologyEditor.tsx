import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'

const LINE = 29 // px, matches the textarea line-height in app.css
const PAD = 28 // vertical padding inside the textarea
const MIN_LINES = 6
const MAX_LINES = 12

type Props = { value: string; onChange: (v: string) => void; wordCount: number; onClear: () => void }

export const ApologyEditor = forwardRef<HTMLTextAreaElement, Props>(function ApologyEditor(
  { value, onChange, wordCount, onClear },
  ref,
) {
  const areaRef = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement)

  // Grow with content from 6 to about 12 lines, then scroll.
  useLayoutEffect(() => {
    const el = areaRef.current
    if (!el) return
    el.style.height = 'auto'
    const min = MIN_LINES * LINE + PAD
    const max = MAX_LINES * LINE + PAD
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }, [value])

  return (
    <section className="editor">
      <label htmlFor="apology" className="editor__label">
        Your apology
      </label>
      <div className="editor__sheet">
        <textarea
          id="apology"
          ref={areaRef}
          className="editor__area"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'Start with what you did. For example: "I\'m sorry I missed your birthday."'}
          spellCheck
          autoComplete="off"
        />
      </div>
      <div className="editor__meta">
        <span className="muted small">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        {value.length > 0 && (
          <button type="button" className="text-btn text-btn--small editor__clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </section>
  )
})
