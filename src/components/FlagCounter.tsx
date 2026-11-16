export function FlagCounter({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null
  return (
    <button className="counter" onClick={onClick}>
      {count} {count === 1 ? 'thing' : 'things'} to look at
    </button>
  )
}
