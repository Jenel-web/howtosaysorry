import { Overlay } from './Overlay'

export function ClearConfirm({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <Overlay
      variant="dialog"
      title="Clear your message?"
      description="This can't be undone. Nothing is saved."
      onClose={onClose}
    >
      <div className="dialog-buttons">
        <button type="button" className="text-btn" onClick={onClose}>
          Keep writing
        </button>
        <button type="button" className="btn btn--primary btn--compact" onClick={onConfirm}>
          Clear
        </button>
      </div>
    </Overlay>
  )
}
