import { PencilIcon } from './Icons'

export function Header({ onStart }: { onStart: () => void }) {
  return (
    <header className="header">
      <div className="header__titles">
        <h1 className="header__title">Say sorry, properly</h1>
        <p className="header__sub">Write what you want to say. Nothing is saved or sent.</p>
      </div>
      <button type="button" className="text-btn start-btn" onClick={onStart}>
        <PencilIcon />
        Need a start?
      </button>
    </header>
  )
}
