export type Strength = 'strong' | 'weak'

// A word, a list of alternative words, or a group name like '@sorry'.
// A trailing * matches any ending: 'offend*' matches offend, offended, offensive.
export type Term = string | string[]

// Ordered match: these words, in this order, each within `gap` words of the previous one.
// Use when order matters ("sorry ... you ... upset" is not "you ... upset ... sorry").
export type SeqSpec = {
  seq: Term[]
  gap?: number // max words allowed between neighbours (default 3)
  stop?: Term // none of these words may sit in those gaps (e.g. "i")
  also?: Term[] // each must appear somewhere in the same sentence
  crossSentence?: boolean // allow the match to span a . ! ? (default: no)
}

// Key-word match: all of these words appear within `within` words of each other, ANY order.
// Pick the 2-3 words that carry the meaning: ['push*', 'button*'] catches "you really
// push my buttons", "pressing all my buttons", "buttons you keep pushing".
export type NearSpec = {
  near: Term[]
  within?: number // the whole group must fit in this many words (default 5)
  unless?: Term // if one of these sits in the group (or 4 words before), skip: "not" in "not your fault"
  also?: Term[]
  crossSentence?: boolean
}

export type Rule = Partial<SeqSpec> &
  Partial<NearSpec> & {
    id: string
    strength: Strength
    question: string
    // Use `pattern` for fixed idioms; `seq` / `near` for ideas that can be worded many ways.
    pattern?: RegExp // global, case-insensitive
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
