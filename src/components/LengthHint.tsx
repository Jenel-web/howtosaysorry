export function LengthHint({ hints }: { hints: string[] }) {
  if (!hints.length) return null
  return (
    <ul className="hints">
      {hints.map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
  )
}
