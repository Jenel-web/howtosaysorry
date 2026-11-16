export type Strength = 'strong' | 'weak'

export type Rule = {
  id: string
  strength: Strength
  pattern: RegExp // global, case-insensitive
  question: string
  // Optional "don't flag this" guards, so edge cases live in the data too.
  skipBefore?: RegExp // tested on the text before the match, same sentence only
  skipAfter?: RegExp // tested on the text right after the match
}

export type Flag = {
  ruleId: string
  strength: Strength
  start: number
  end: number
  match: string
  question: string
  ignored: boolean
}
