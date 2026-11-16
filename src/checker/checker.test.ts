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

const ids = (t: string) => check(t).map((f) => f.ruleId)

describe('extended rules fire', () => {
  const cases: [string, string][] = [
    ['sorry you took it that way', 'took_it_that_way'],
    ["I'm sorry you're so upset", 'other_state'],
    ["I'm sorry you're bothered by what I said", 'sorry_hurt_by'], // "you were/are" is already red via sorry_you_feel
    ["I'm sorry if you were hurt", 'if_i_hurt'],
    ['Mistakes were made.', 'agentless'],
    ['Sorry not sorry.', 'sorry_not_sorry'],
    ['Oh sorry for breathing.', 'sarcasm'],
    ['I apologize to anyone I may have hurt.', 'generic_audience'],
    ['I said I\'m sorry. What more do you want?', 'forgiveness_demand'],
    ["That's not what happened.", 'relitigating'],
    ['In my defense, I was tired.', 'in_my_defense'],
    ['You owe me an apology too.', 'counter_accusation'],
    ["Sorry I'm not as perfect as you.", 'backhanded'],
    ['I regret that this happened.', 'regret_only'],
    ['I was only trying to help.', 'intent_over_impact'],
    ['I guess I was wrong.', 'hedging'],
    ['I did it because I was tired.', 'unprompted_explanation'],
    ['We regret any inconvenience this may have caused.', 'corporate_wording'],
    ["Are we good?", 'pressure'],
    ["I'll apologize if you do.", 'reciprocity'],
    ["Let's just move on.", 'move_on'],
    ["I'm such a bad person.", 'self_pity'],
    ['If you forgive me, we can go out.', 'apology_for_a_trade'],
    ['Thanks for putting up with me.', 'fake_gratitude'],
    ['Sorry for everything.', 'vague_apology'],
    ["I'm so so sorry.", 'repeated_sorry'],
    ["I'll try to do better.", 'no_specifics_promise'],
    ['It will never happen again.', 'absolute_promise'],
  ]
  it.each(cases)('%s -> %s', (text, id) => expect(ids(text)).toContain(id))

  it('levels: red for expert-backed, normal for the rest', () => {
    expect(check('Mistakes were made.')[0].strength).toBe('strong')
    expect(check('Sorry for everything.')[0].strength).toBe('weak')
  })
})

describe('suppression (no flag)', () => {
  const clean: [string, string][] = [
    ['sympathy', "I'm sorry for your loss."],
    ['sympathy 2', "I'm sorry you're going through this."],
    ['refusal', "I'm sorry, but I can't make it tonight."],
    ['invitation', "I'm sorry. But I'd like to explain when you're ready."],
    ['harmless if', "Sorry if I'm late. Let me know if you want space."],
    ['quoted', 'You said "you always overreact" and that hurt me.'],
    ['negation', "I'm not saying you're overreacting."],
    ['self absolute', 'I never meant to hurt you. I will always be here.'],
  ]
  it.each(clean)('%s', (_n, text) => expect(check(text)).toEqual([]))

  it('a real excuse still flags', () => expect(ids("I'm sorry, but I was stressed.")).toContain('sorry_but'))
  it('one card per phrase', () => expect(ids("I'm sorry you are upset")).toEqual(['other_state']))
})

describe('situation hints', () => {
  it('asked for space', () => expect(messageHints('I know you said you need space, but I am sorry I yelled at you.').join()).toContain('asked for space'))
  it('self-blame', () => expect(messageHints("It's all my fault, I am so sorry for what happened yesterday.").join()).toContain('yours to own'))
  it('group', () => expect(messageHints('We are sorry for what happened at the event last week.').join()).toContain('Who is "we"'))
  it('legal', () => expect(messageHints('I am sorry, I know I could be liable for the damage to your car.').join()).toContain('legal'))
  it('many sorrys', () => expect(messageHints('Sorry. Sorry. Sorry, I really messed up the plans.').join()).toContain('more than once'))
})
