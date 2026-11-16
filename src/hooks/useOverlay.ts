import { useState } from 'react'

export type OverlayName = 'starter' | 'checklist' | 'pause' | 'clear' | null

// Only one overlay at a time by construction.
export function useOverlay() {
  const [open, setOpen] = useState<OverlayName>(null)
  return { open, show: setOpen, close: () => setOpen(null) }
}
