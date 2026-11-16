import { forwardRef } from 'react'
import type { Flag } from '../checker'
import { FlagCard } from './FlagCard'

type Props = { flags: Flag[]; onIgnore: (f: Flag) => void; onShow: (f: Flag) => void }

function headingFor(strong: number, weak: number) {
  if (strong > 0) return `${strong} ${strong === 1 ? 'thing' : 'things'} to look at`
  if (weak > 0) return `${weak} ${weak === 1 ? 'thing' : 'things'} worth a second look`
  return ''
}

export const FlagList = forwardRef<HTMLElement, Props>(function FlagList({ flags, onIgnore, onShow }, ref) {
  const strong = flags.filter((f) => f.strength === 'strong').length
  const heading = headingFor(strong, flags.length - strong)

  return (
    <>
      {/* Always mounted so the counter is announced politely when the section first appears. */}
      <p className="visually-hidden" aria-live="polite">
        {heading}
      </p>
      {flags.length > 0 && (
        <section ref={ref} className="flags" aria-labelledby="flags-heading">
          <h2 id="flags-heading" className="flags__heading">
            {heading}
          </h2>
          <div className="flags__list">
            {flags.map((f) => (
              <FlagCard key={`${f.ruleId}${f.start}`} flag={f} onIgnore={() => onIgnore(f)} onShow={() => onShow(f)} />
            ))}
          </div>
        </section>
      )}
    </>
  )
})
