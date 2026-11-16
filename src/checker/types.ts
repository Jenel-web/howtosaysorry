export type Strength = 'strong' | 'weak'

export type Rule = {
  id: string
  strength: Strength
  pattern: RegExp // global, case-insensitive
  question: string
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
