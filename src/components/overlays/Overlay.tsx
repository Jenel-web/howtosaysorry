import { useEffect, useId, useRef, type ReactNode } from 'react'
import { CloseIcon } from '../Icons'

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

type Props = {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  /** sheet: bottom sheet on mobile, centered modal on desktop. dialog: small centered box. */
  variant?: 'sheet' | 'dialog'
  titleClassName?: string
}

export function Overlay({ title, description, onClose, children, variant = 'sheet', titleClassName }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    titleRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className={`overlay overlay--${variant}`}>
      <div className="overlay__backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        {variant === 'sheet' && <span className="overlay__grabber" aria-hidden="true" />}
        <div className="overlay__head">
          <div className="overlay__titles">
            <h2 id={titleId} ref={titleRef} tabIndex={-1} className={titleClassName || 'overlay__title'}>
              {title}
            </h2>
            {description && (
              <p id={descId} className="overlay__desc">
                {description}
              </p>
            )}
          </div>
          {variant === 'sheet' && (
            <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
