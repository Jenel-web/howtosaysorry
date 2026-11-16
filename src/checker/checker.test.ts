import { describe, expect, it } from 'vitest'
import { check, messageHints } from './index'

const strong = (t: string) => check(t).filter((f) => f.strength === 'strong').map((f) => f.ruleId)

describe('SPEC test cases', () => {
  it('1 good apology', () => expect(strong("I'm sorry I missed your birthday. I know it hurt you. I'll put it in my calendar from now on.")).toEqual([]))
  it('2', () => expect(strong("I'm sorry, but you never tell me anything.").sort()).toEqual(['always_never', 'sorry_but']))
  it('3', () => expect(strong("I'm sorry you feel that way.")).toEqual(['sorry_you_feel']))
  it('4', () => expect(strong('Sorry if I hurt you.')).toEqual(['if_i_hurt']))
  it('5 weak only', () => {
    const t = "I was stressed at work and snapped. I love you, but that's not an excuse. I'm sorry."
    expect(strong(t)).toEqual([])
    expect(check(t).map((f) => f.ruleId)).toEqual(['loose_but'])
  })
  it('6', () => expect(strong('You made me so angry that I yelled. Sorry.')).toEqual(['blame_shift']))
  it('7', () => {
    const t = "It was just a joke, you're overreacting."
    expect(strong(t)).toEqual(['minimizing', 'minimizing'])
  })
  it('8 good apology', () => expect(strong("I'm really sorry I lied about where I was. You deserved the truth. I won't do that again.")).toEqual([]))
  it('9 short hint', () => expect(messageHints('Sorry.')).toContain('This may feel brief. Have you said what you did?'))
  it('10', () => {
    const t = "I apologize for what I said, but honestly you always do this, so we're good now right?"
    expect(strong(t).sort()).toEqual(['always_never', 'sorry_but'])
    expect(check(t).map((f) => f.ruleId)).toContain('pressure')
  })
})
