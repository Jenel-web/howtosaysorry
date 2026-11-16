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
    ["I'm sorry you're so upset", 'sorry_you_feel'],
    ["I'm sorry you're bothered by what I said", 'sorry_you_feel'],
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

describe('synonyms and variants fire', () => {
  const variants: [string, string][] = [
    // sorry you feel
    ["I apologize that you're feeling this way.", 'sorry_you_feel'],
    ["I regret that you felt that way", 'sorry_you_feel'],
    ['Sorry to hear you feel that way', 'sorry_you_feel'],
    ["I'm sorry you got upset", 'sorry_you_feel'],
    ["I'm sorry you're feeling so offended", 'sorry_you_feel'],
    // conditional if
    ['I apologize if my words offended you.', 'if_i_hurt'],
    ['Sorry if what I said upset you.', 'if_i_hurt'],
    ["If I did something wrong, I'm sorry.", 'if_i_hurt'],
    ['Sorry if you were offended.', 'if_i_hurt'],
    ['Sorry if that hurt.', 'if_i_hurt'],
    ['Sorry if anyone was upset.', 'generic_audience'],
    // took it that way
    ['Sorry you misunderstood me.', 'took_it_that_way'],
    ['I regret that my words were misinterpreted.', 'took_it_that_way'],
    ['I am sorry you took it the wrong way.', 'took_it_that_way'],
    // blame
    ["It's your fault I yelled.", 'blame_shift'],
    ['You forced me to say it.', 'blame_shift'],
    ['You left me no choice.', 'blame_shift'],
    ['If you hadn\'t pushed, I would not have snapped.', 'blame_shift'],
    ['You brought this on yourself.', 'blame_shift'],
    // minimizing
    ["You're being so dramatic.", 'minimizing'],
    ['It is no big deal, get over it.', 'minimizing'],
    ["I was only kidding.", 'minimizing'],
    ["You're blowing this out of proportion.", 'minimizing'],
    ["Can't you take a joke?", 'minimizing'],
    // generalizations
    ["You're always late.", 'always_never'],
    ['You constantly do this.', 'always_never'],
    ['You keep ignoring me.', 'always_never'],
    ['Every time you talk, I flinch.', 'always_never'],
    // but synonyms
    ["I'm sorry, however you did it too.", 'sorry_but'],
    ['I apologize, although I was tired.', 'sorry_but'],
    ['My apologies, but I was busy.', 'sorry_but'],
    ['I regret it, nevertheless it had to be said.', 'sorry_but'],
    ['I love you, however that is not an excuse.', 'loose_but'],
    // agentless
    ['A mistake was made.', 'agentless'],
    ['Tempers flared.', 'agentless'],
    ['It was a lapse in judgment.', 'agentless'],
    ['Things got heated.', 'agentless'],
    // not sorry
    ["I'm not sorry.", 'sorry_not_sorry'],
    ["I'm only sorry that you found out.", 'sorry_not_sorry'],
    // sarcasm
    ['Sorry for being alive.', 'sarcasm'],
    ['Well excuse me for having feelings.', 'sarcasm'],
    // generic audience
    ['I apologize if anyone was offended.', 'generic_audience'],
    ['To those offended, I am sorry.', 'generic_audience'],
    ['Whoever was hurt, my bad.', 'generic_audience'],
    // demand
    ['How many times must I say sorry?', 'forgiveness_demand'],
    ["Isn't that enough?", 'forgiveness_demand'],
    ["I've already apologized.", 'forgiveness_demand'],
    ['Just forgive me.', 'forgiveness_demand'],
    ['What else do you want from me?', 'forgiveness_demand'],
    // relitigating etc.
    ["That isn't what happened.", 'relitigating'],
    ["I never said that.", 'relitigating'],
    ['For the record, I was on time.', 'relitigating'],
    ["You're twisting my words.", 'relitigating'],
    ['In fairness, you also yelled.', 'in_my_defense'],
    ["I'm not making excuses, I was tired.", 'in_my_defense'],
    ['You did the same thing last week.', 'counter_accusation'],
    ["Sorry I'm only human.", 'backhanded'],
    // regret / intent / hedging
    ["I wish this hadn't happened.", 'regret_only'],
    ['Sorry that this happened.', 'regret_only'],
    ['I meant well.', 'intent_over_impact'],
    ['My intentions were good.', 'intent_over_impact'],
    ['Fine, I am sorry.', 'hedging'],
    ['I suppose I am sorry.', 'hedging'],
    ['Maybe I was a bit out of line.', 'hedging'],
    ['I was kind of rude.', 'hedging'],
    ['I had a rough day.', 'unprompted_explanation'],
    ['You have to understand my side.', 'unprompted_explanation'],
    ['We deeply regret this.', 'corporate_wording'],
    // pressure, reciprocity, move on
    ['Are we cool now?', 'pressure'],
    ['Can we be friends again?', 'pressure'],
    ['You should apologize too.', 'reciprocity'],
    ['I will apologize when you do.', 'reciprocity'],
    ['Can we just drop it?', 'move_on'],
    ['Never mind.', 'move_on'],
    ["It's all in the past.", 'move_on'],
    ["Forget it.", 'move_on'],
    // self pity, trade, gratitude
    ["I'm a terrible person.", 'self_pity'],
    ["I can't forgive myself.", 'self_pity'],
    ["This is so hard for me.", 'self_pity'],
    ['I do not deserve you.', 'self_pity'],
    ['Can we go back to normal?', 'apology_for_a_trade'],
    ['Please take me back.', 'apology_for_a_trade'],
    ['Thank you for tolerating me.', 'fake_gratitude'],
    // vague, repeats, promises
    ['I apologize for anything I did.', 'vague_apology'],
    ['Sorry for all the trouble.', 'vague_apology'],
    ['Sorry sorry sorry.', 'repeated_sorry'],
    ['Please please forgive me.', 'repeated_sorry'],
    ["I'll be more careful.", 'no_specifics_promise'],
    ['This will not happen again.', 'no_specifics_promise'],
    ['I will never do that again.', 'absolute_promise'],
    ['I swear I will never hurt you again.', 'absolute_promise'],
    ["I'll do whatever it takes.", 'absolute_promise'],
  ]
  it.each(variants)('%s -> %s', (text, id) => expect(ids(text)).toContain(id))
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
    ['self absolute', 'I will always be here, and I never want to lose you.'],
    ['ownership', 'I hurt you, and that was on me. I did it, and I am sorry.'],
    ['refusal then plan', "Sorry, I can't make it tonight, but let's reschedule."],
    ['honest difficulty', 'This is hard for me to say. I am sorry I lied to you.'],
    ['warm always', "You always matter to me, and you can always call me."],
    ['not your fault', "It's not your fault. It wasn't your fault at all."],
    ['never forget', "I'll never forget it, and I won't forget about it."],
    ['hindsight but-less', 'I hurt you and I own that.'],
  ]
  it.each(clean)('%s', (_n, text) => expect(check(text)).toEqual([]))

  it('a real excuse still flags', () => expect(ids("I'm sorry, but I was stressed.")).toContain('sorry_but'))
  it('one card per phrase', () => expect(ids("I'm sorry you are upset")).toEqual(['sorry_you_feel']))
})

describe('denying intent, awareness, or being yourself', () => {
  const denials: [string, string][] = [
    // not + mean/intend, any wording
    ["It's not my intention to hurt you.", 'intent_denial'],
    ["That wasn't my intention.", 'intent_denial'],
    ['My intention was never to upset you, honestly.', 'intent_denial'],
    ["I didn't mean to hurt you.", 'intent_denial'],
    ["I didn't mean it that way.", 'intent_denial'],
    ["Didn't mean it like that.", 'intent_denial'],
    ['I never meant for it to go this way.', 'intent_denial'],
    ['It was not meant to be hurtful.', 'intent_denial'],
    ['I never intended any of this.', 'intent_denial'],
    ['I did not do it on purpose.', 'intent_denial'],
    ["It wasn't deliberate.", 'intent_denial'],
    ["That's not what I wanted.", 'intent_denial'],
    ['I never wanted this to happen.', 'intent_denial'],
    ["I really didn't want to hurt you.", 'intent_denial'],
    ["I wasn't trying to upset you.", 'intent_denial'],
    ["I didn't set out to hurt anyone.", 'intent_denial'],
    ['I would never hurt you.', 'intent_denial'],
    // not knowing
    ["I didn't realize it would hurt.", 'not_aware'],
    ['I was not thinking at all.', 'not_aware'],
    ['I had no idea it would upset you.', 'not_aware'],
    // slips
    ['It was an accident.', 'accident_framing'],
    ['I said it unintentionally.', 'accident_framing'],
    ["It just didn't come out right.", 'accident_framing'],
    ['That was a poor choice of words.', 'accident_framing'],
    ['It slipped out.', 'accident_framing'],
    // not me
    ["That wasn't me.", 'not_myself'],
    ["I wasn't myself that day.", 'not_myself'],
    ["That's not like me.", 'not_myself'],
    ["That's not who I am.", 'not_myself'],
    ["I'm just not that kind of person.", 'not_myself'],
    ['It was out of character for me.', 'not_myself'],
    ["I don't know what came over me.", 'not_myself'],
    // warnings before the hurtful part
    ['No offense, but you were late.', 'preemptive_disclaimer'],
    ['Not to be rude, but I was right.', 'preemptive_disclaimer'],
    ['With all due respect, I disagree.', 'preemptive_disclaimer'],
    // red: asking them to accept it
    ["You know I didn't mean that.", 'intent_you_know'],
    ['You know I would never hurt you.', 'intent_you_know'],
  ]
  it.each(denials)('%s -> %s', (text, id) => expect(ids(text)).toContain(id))

  it('denials are normal-level, except asking them to accept it', () => {
    expect(check("I didn't mean to hurt you.")[0].strength).toBe('weak')
    expect(check("You know I didn't mean that.")[0].strength).toBe('strong')
  })

  it('remorse and plain words stay clean', () => {
    expect(check("I can't stop thinking about what I did to you. I'm sorry.")).toEqual([])
    expect(check('I said things in anger. Those words hurt you, and I am sorry.')).toEqual([])
  })

  it('owning the impact stays clean', () => {
    expect(check("I'm sorry I hurt you. I said that, and it was unkind.")).toEqual([])
    expect(check("I'm sorry. I know that hurt you, and I should have thought first.")).toEqual([])
  })
})

describe('key words near each other, any order', () => {
  const keyWords: [string, string][] = [
    // the cases that were missed
    ["it's your fault", 'blame_shift'],
    ["It is really all your fault.", 'blame_shift'],
    ['The blame is on you.', 'blame_shift'],
    ["it's not my fault", 'denial'],
    ["It really wasn't my fault.", 'denial'],
    ["I'm not to blame for any of this.", 'denial'],
    ['I am not responsible for what happened.', 'denial'],
    ['you really push my buttons', 'blame_shift'],
    ['You really pushed all of my buttons.', 'blame_shift'],
    ['My buttons keep getting pressed by you.', 'blame_shift'],
    ['It gets on my nerves when you do that.', 'blame_shift'],
    ['You drive me completely crazy.', 'blame_shift'],
    ['You asked for it.', 'blame_shift'],
    ['You are the reason I snapped.', 'blame_shift'],
    ['I only did it because of you.', 'blame_shift'],
    ['If you had just listened, none of this would have happened.', 'blame_shift'],
    // minimizing, any order
    ['Honestly it was only a joke.', 'minimizing'],
    ['I was kidding.', 'minimizing'],
    ["It's not that big of a deal.", 'minimizing'],
    ['You need to just relax.', 'minimizing'],
    ["You should get over it.", 'minimizing'],
    ["Don't take it so seriously.", 'minimizing'],
    // other
    ['A mistake was made.', 'agentless'],
    ['Errors have been made on my side.', 'agentless'],
    ['I said sorry already.', 'forgiveness_demand'],
    ['What do you want from me?', 'forgiveness_demand'],
    ['I apologize to anyone who might have been hurt.', 'generic_audience'],
    ["That didn't happen.", 'relitigating'],
    ['I never said that.', 'relitigating'],
    ['Are we okay after this?', 'pressure'],
  ]
  it.each(keyWords)('%s -> %s', (text, id) => expect(ids(text)).toContain(id))

  it("kind or ownership wording near the same key words is not flagged", () => {
    expect(check("It's not your fault.")).toEqual([])
    expect(check("It was my fault, and I'm sorry.")).toEqual([])
    expect(check('I made a mistake and I am sorry.')).toEqual([])
    expect(check("I'm sorry I pushed your buttons earlier.").map((f) => f.ruleId)).toContain('blame_shift') // false alarm is OK
    expect(check('I need to get over this and learn from it.')).toEqual([])
  })
})

describe('word-distance rules: same idea, different words', () => {
  const flexible: [string, string][] = [
    // sorry ... you ... reaction, with filler words in between
    ['I am truly sorry that you ended up feeling hurt.', 'sorry_you_feel'],
    ['I apologise that it seems you were quite offended.', 'sorry_you_feel'],
    ['Sorry you seem really upset about it.', 'sorry_you_feel'],
    // if ... harm, in any phrasing
    ['Apologies if what I did was somehow hurtful.', 'if_i_hurt'],
    ['If my tone came across as insulting, I regret that.', 'if_i_hurt'],
    ['I apologize in case this upsets you, if it is wrong.', 'if_i_hurt'],
    // you ... took ... wrong way
    ['Sorry you read it all the wrong way.', 'took_it_that_way'],
    ['I regret that my message was somehow misconstrued.', 'took_it_that_way'],
    // blame
    ['You really did make me feel awful, so it is on you.', 'blame_shift'],
    ['It is honestly all your own fault.', 'blame_shift'],
    ['You pretty much forced me to do it.', 'blame_shift'],
    // minimizing
    ['You really are so very sensitive.', 'minimizing'],
    ['This was not really that big of a deal.', 'minimizing'],
    ["You're honestly just being dramatic.", 'minimizing'],
    ['I was only kind of joking around.', 'minimizing'],
    // generalizations
    ['You pretty much never listen to me.', 'always_never'],
    ['You are, like, constantly late.', 'always_never'],
    // demand
    ['How many more times am I supposed to say sorry?', 'forgiveness_demand'],
    ['I already told you, I said sorry twice.', 'forgiveness_demand'],
    ['Stop acting so petty about it.', 'forgiveness_demand'],
    ['What else can I possibly do?', 'forgiveness_demand'],
    // weak ones
    ['That is totally not what actually happened.', 'relitigating'],
    ['I was really just trying my best to help.', 'intent_over_impact'],
    ['I guess maybe I am sorry about it.', 'hedging'],
    ['I am somewhat sorry about it.', 'hedging'],
    ['Because my phone died, I never called.', 'unprompted_explanation'],
    ['You really should understand my side.', 'unprompted_explanation'],
    ['You definitely should say sorry as well.', 'reciprocity'],
    ["I'll say sorry once you do.", 'reciprocity'],
    ['Let us just move on from this.', 'move_on'],
    ['Can we please just forget about all of this?', 'move_on'],
    ["I'm such a total failure.", 'self_pity'],
    ['I will definitely try to be a much better person.', 'no_specifics_promise'],
    ['I promise I will never ever hurt you again.', 'absolute_promise'],
    ["I'm sorry, really sorry, truly.", 'repeated_sorry'],
    ['I am sorry for absolutely everything.', 'vague_apology'],
  ]
  it.each(flexible)('%s -> %s', (text, id) => expect(ids(text)).toContain(id))

  it('a good apology that shares the same words stays clean', () => {
    expect(check("I'm sorry I hurt you. I know you were upset, and I was wrong to say it.")).toEqual([])
    expect(check("I know you're hurt, and I'm sorry I made you feel that way.")).toEqual([])
    expect(check("I'm sorry. You didn't deserve to be spoken to like that.")).toEqual([])
  })
})

describe('situation hints', () => {
  it('asked for space', () => expect(messageHints('I know you said you need space, but I am sorry I yelled at you.').join()).toContain('asked for space'))
  it('self-blame', () => expect(messageHints("It's all my fault, I am so sorry for what happened yesterday.").join()).toContain('yours to own'))
  it('group', () => expect(messageHints('We are sorry for what happened at the event last week.').join()).toContain('Who is "we"'))
  it('legal', () => expect(messageHints('I am sorry, I know I could be liable for the damage to your car.').join()).toContain('legal'))
  it('space synonyms', () => expect(messageHints('I know you blocked me and want nothing to do with me, but I am sorry about the fight.').join()).toContain('asked for space'))
  it('apology words count as sorry', () => expect(messageHints('I take responsibility for what I did and I know that I owe you an apology for it.').join()).not.toContain("haven't said sorry"))
  it('many sorrys', () => expect(messageHints('Sorry. Sorry. Sorry, I really messed up the plans.').join()).toContain('more than once'))
})
