import { forwardRef } from 'react'

type Props = { value: string; onChange: (v: string) => void }

export const ApologyEditor = forwardRef<HTMLTextAreaElement, Props>(function ApologyEditor(
  { value, onChange },
  ref,
) {
  return (
    <>
      <label htmlFor="apology" className="sr-only">Your apology</label>
      <textarea
        id="apology"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your apology here…"
        rows={9}
      />
    </>
  )
})
