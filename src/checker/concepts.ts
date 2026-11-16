import { KIND_CONTINUATION, NEGATED, SOUNDS_LIKE_THEIR_REACTION, SYMPATHY } from './rules'
import type { Rule } from './types'

// Word-distance rules. They match an IDEA however it is worded, not one exact phrase.
// Pick the 2-3 words that carry the meaning, then say how close they must be.
//
//   near   = key words, ANY order, all within `within` words ("push" + "buttons")
//   seq    = key words in THIS order, each within `gap` words of the last ("sorry" ... "you" ... "upset")
//   unless = near: a word that cancels it ("not" in "it's not your fault")
//   stop   = seq: a word that must not sit in between ("I" in "sorry I hurt you")
//   also   = a word that must be somewhere in the same sentence
// '@name' is a word group from lexicon.ts, 'word*' matches any ending.
// It is only a warning, so these lean towards a false alarm over a miss.

const SORRY = '@sorry'
const YOU = '@you'
const FIRST = '@first'

// "sorry you're feeling sick" is sympathy, not a deflection.
const SYMPATHY_FEEL = new RegExp(
  SYMPATHY.source + '|^\\s*(?:so\\s+|very\\s+|really\\s+)?(?:sick|ill|unwell|tired|lonely|alone|sad|down|low|stressed|overwhelmed|exhausted|scared|afraid|anxious|worried|lost)',
  'i',
)

const BLAME = 'This may shift the blame to them. Is that what you mean?'
const SMALL = 'This may make their feelings seem small.'
const NEW_ARGUMENT = '"Always" and "never" can start a new argument. Is this about this one time?'
const THEIR_HEARING = 'This may put the problem in how they heard it. Can you name what you said or did?'
const THEIRS_TO_GIVE = 'Forgiveness is theirs to give. Can you leave room for them to respond?'
const SOFTENS = 'Do the hedges soften what you own?'
const RE_ARGUE = 'Does this re-argue what happened? It may start the discussion again.'
const PRESSURE = 'Asking for forgiveness right away can feel like pressure.'
const WAITS = 'Does this wait on them apologizing first?'
const REASON = 'Did they ask for the reason? It may land better after they have heard the apology.'
const INTENT = 'Does this lean on your intent more than on how it landed?'
const RESPOND_FIRST = 'Have they had a chance to respond first?'
const CONCRETE = 'What will you do differently? A concrete step may land better.'

export const conceptRules: Rule[] = [
  // ================= RED: shifting the problem onto them =================
  // sorry ... you ... feel/upset/think. "sorry I hurt you" is blocked by the stop word "i".
  { id: 'sorry_you_feel', strength: 'strong', seq: [SORRY, YOU, '@reaction'], gap: 4, stop: [FIRST, '@if'], question: SOUNDS_LIKE_THEIR_REACTION, skipAfter: SYMPATHY_FEEL },
  // sorry ... if ... hurt/upset/offended/wrong
  { id: 'if_i_hurt', strength: 'strong', seq: ['@if', '@harm'], gap: 6, stop: ['anyone', 'anybody', 'someone', 'whoever'], also: [SORRY], question: '"If" can sound like you doubt it happened. Can you say that it did?' },
  // you took/read it the wrong way, you misunderstood, my words were misinterpreted
  { id: 'took_it_that_way', strength: 'strong', seq: [YOU, ['took', 'read', 'heard', 'saw', 'interpreted', 'understood', 'perceived', 'received'], ['wrong', 'wrongly', 'differently', 'personally', 'offense', 'offence', 'way', 'badly']], gap: 5, question: THEIR_HEARING },
  { id: 'took_it_that_way', strength: 'strong', seq: [YOU, '@mis'], gap: 2, question: THEIR_HEARING },
  { id: 'took_it_that_way', strength: 'strong', seq: [SORRY, ['was', 'were', 'got', 'been', 'being'], '@mis'], gap: 5, question: THEIR_HEARING },
  { id: 'took_it_that_way', strength: 'weak', near: [['not'], ['how', 'what'], ['meant', 'intended', 'mean']], within: 5, question: THEIR_HEARING },

  // ================= RED: blame =================
  // you made/forced/pushed me
  { id: 'blame_shift', strength: 'strong', seq: [YOU, '@causes', ['me', 'us']], gap: 3, question: BLAME },
  // "it's your fault", "you're to blame", "the blame is on you"; "it's NOT your fault" is kind, so "not" cancels it
  { id: 'blame_shift', strength: 'strong', near: [['fault', 'blame'], YOU], within: 5, unless: ['not', 'no', 'never'], question: BLAME },
  // "you push my buttons", "pressing all my buttons", "gets on my nerves"
  { id: 'blame_shift', strength: 'strong', near: [['push*', 'press*', 'hit*'], ['button*']], within: 5, question: BLAME },
  { id: 'blame_shift', strength: 'strong', near: [['get', 'gets', 'getting', 'got', 'grate*', 'work*', 'test*'], ['nerve*'], ['on', 'under']], within: 5, question: BLAME },
  // "you drive me crazy"
  { id: 'blame_shift', strength: 'strong', near: [YOU, ['drive', 'drives', 'driving', 'drove'], ['me'], ['crazy', 'insane', 'nuts', 'mad', 'wall', 'angry']], within: 7, question: BLAME },
  // "you started it", "you asked for it", "you deserved it", "you brought it on yourself"
  { id: 'blame_shift', strength: 'strong', near: [YOU, ['started', 'deserved', 'provoked', 'caused', 'brought', 'earned', 'asked'], ['it', 'this', 'yourself']], within: 5, question: BLAME },
  // "you left me no choice", "you gave me no option"
  { id: 'blame_shift', strength: 'strong', seq: [YOU, ['left', 'gave', 'giving'], 'me', 'no'], gap: 1, question: BLAME },
  // "this is on you", "that's on you"
  { id: 'blame_shift', strength: 'strong', near: ['on', YOU, ['this', 'blame', 'fault']], within: 4, question: BLAME },
  // "you're the reason I snapped"
  { id: 'blame_shift', strength: 'strong', near: [YOU, 'reason', ['i', 'we', 'this']], within: 5, question: BLAME },
  // "because of you", "because you ..."
  { id: 'blame_shift', strength: 'strong', near: [['because', 'cause'], YOU], within: 3, question: BLAME },
  // "if you hadn't ...", "if you had just listened"
  { id: 'blame_shift', strength: 'strong', near: ['if', YOU, ['had', 'have', 'would', 'did'], ['not', 'just', 'only']], within: 5, question: BLAME },
  // "it's not my fault", "I'm not to blame", "I'm not responsible"
  { id: 'denial', strength: 'strong', near: [['fault', 'blame', 'responsible', 'guilty'], ['not', 'no', 'never'], ['my', 'me', 'mine', 'i']], within: 5, question: 'Saying it is not your fault can sound like you are not owning your part. Is there a part that is yours?' },

  // ================= RED: minimizing =================
  // you're so sensitive / being dramatic / exaggerating
  { id: 'minimizing', strength: 'strong', near: [YOU, ['sensitive', 'dramatic', 'emotional', 'irrational', 'crazy', 'ridiculous', 'petty', 'childish', 'touchy', 'hysterical', 'silly', 'paranoid', 'insecure', 'exaggerat*']], within: 7, skipBefore: NEGATED, question: SMALL },
  { id: 'minimizing', strength: 'strong', near: [['overreact*', 'oversensitive', 'hysterical', 'melodramatic', 'overdramatic']], skipBefore: NEGATED, question: SMALL },
  // it was just a joke / I was only kidding / it was a joke
  { id: 'minimizing', strength: 'strong', near: [['just', 'only', 'merely', 'simply'], ['joke', 'jokes', 'joking', 'kidding', 'teasing', 'banter']], within: 5, skipBefore: NEGATED, question: SMALL },
  { id: 'minimizing', strength: 'strong', near: [['was', 'is', 'it'], ['joke', 'joking', 'kidding']], within: 3, skipBefore: NEGATED, question: SMALL },
  // not a big deal / no big deal / not that serious
  { id: 'minimizing', strength: 'strong', near: [['not', 'no'], ['big', 'major', 'huge', 'serious', 'biggie'], ['deal', 'issue', 'problem', 'thing']], within: 5, skipBefore: NEGATED, question: SMALL },
  { id: 'minimizing', strength: 'strong', near: [['not', 'no'], ['that', 'so', 'very', 'really', 'too'], ['bad', 'serious', 'severe', 'big', 'tragic']], within: 4, skipBefore: NEGATED, question: SMALL },
  // calm down / you need to relax
  { id: 'minimizing', strength: 'strong', seq: ['calm', ['down', 'yourself', 'it']], gap: 1, skipBefore: NEGATED, question: SMALL },
  { id: 'minimizing', strength: 'strong', near: [YOU, ['need', 'should', 'must', 'have', 'just'], ['relax', 'chill', 'breathe']], within: 5, skipBefore: NEGATED, question: SMALL },
  // making a big deal out of it / blowing it out of proportion
  { id: 'minimizing', strength: 'strong', near: [['make', 'making', 'makes', 'made', 'blow', 'blowing'], ['deal', 'scene', 'mountain', 'proportion', 'molehill']], within: 4, skipBefore: NEGATED, question: SMALL },
  // get over it ("I need to get over it" is about yourself, so "i" cancels it)
  { id: 'minimizing', strength: 'strong', near: [['get', 'getting'], ['over', 'past'], ['it', 'this', 'yourself', 'that']], within: 3, unless: ['i', 'my', 'myself'], skipBefore: NEGATED, question: SMALL },
  // don't take it so seriously / can't take a joke
  { id: 'minimizing', strength: 'strong', near: [['not'], ['take'], ['joke', 'seriously', 'personally']], within: 5, skipBefore: NEGATED, question: SMALL },

  // ================= RED: generalizing, dodging, asking for something back =================
  { id: 'always_never', strength: 'strong', seq: [YOU, ['never', 'constantly', 'forever', 'continually', 'perpetually', 'repeatedly']], gap: 3, stop: ['will', 'would'], skipAfter: KIND_CONTINUATION, question: NEW_ARGUMENT },
  // "you can always call me" is warm, so "always" gets one more guard than "never"
  { id: 'always_never', strength: 'strong', seq: [YOU, 'always'], gap: 3, stop: ['will', 'would'], skipAfter: new RegExp(KIND_CONTINUATION.source + '|^\\s*(?:talk|call|come|count|reach|text)\\b', 'i'), question: NEW_ARGUMENT },
  // "to anyone who may have been hurt" (only when the writer is also saying sorry)
  { id: 'generic_audience', strength: 'strong', near: [['anyone', 'anybody', 'whoever', 'those', 'everyone', 'everybody'], ['hurt*', 'offend*', 'upset*', 'harm*', 'wrong*', 'affect*', 'insult*', 'disrespect*']], within: 7, also: [SORRY], question: 'Who are you apologizing to? Naming them can matter.' },
  // "a mistake was made", "errors happened" ("I made a mistake" is owning it, so "i/my/you" cancels it)
  { id: 'agentless', strength: 'strong', near: [['mistake*', 'error*', 'misstep*', 'lapse*'], ['made', 'happened', 'occurred', 'was', 'were', 'been']], within: 4, unless: [FIRST, YOU], question: 'Who made the mistake? Naming yourself can help this land.' },
  // how many times do I have to say sorry / how long will you stay mad / what more do you want
  { id: 'forgiveness_demand', strength: 'strong', seq: ['how', ['many', 'long', 'much', 'often'], ['say', 'tell', 'apolog*', 'sorry']], gap: 6, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', seq: ['how', 'long', ['mad', 'angry', 'upset', 'punish*', 'ignor*', 'sulk*', 'pout*']], gap: 6, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', seq: ['what', ['more', 'else'], ['want', 'can', 'should', 'would']], gap: 1, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', near: ['what', 'want', YOU, 'me'], within: 7, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', near: [['stop', 'quit'], ['mad', 'angry', 'upset', 'sulking', 'pouting', 'ignoring', 'punishing', 'petty', 'childish', 'silent', 'dramatic', 'holding']], within: 4, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', near: ['already', SORRY], within: 5, question: THEIRS_TO_GIVE },
  { id: 'forgiveness_demand', strength: 'strong', seq: ['not', ['that', 'it', 'this'], 'enough'], gap: 1, question: THEIRS_TO_GIVE },

  // ================= NORMAL: shifting the problem =================
  { id: 'relitigating', strength: 'weak', near: [['not'], ['what', 'how'], ['happened', 'said', 'meant', 'went', 'occurred', 'remember*']], within: 4, question: RE_ARGUE },
  { id: 'relitigating', strength: 'weak', near: [YOU, ['misremember*', 'exaggerat*', 'lying', 'lied', 'twisting', 'twisted', 'distorting', 'remember*', 'recall*'], ['wrong', 'backwards', 'twisted', 'misremember*', 'exaggerat*', 'lying', 'lied', 'twisting', 'distorting']], within: 5, question: RE_ARGUE },
  { id: 'relitigating', strength: 'weak', near: [['never', 'not'], 'happen*'], within: 3, unless: ['again'], question: RE_ARGUE },
  { id: 'relitigating', strength: 'weak', near: [['not', 'never'], ['said', 'say'], ['that', 'it', 'those']], within: 4, question: RE_ARGUE },
  { id: 'in_my_defense', strength: 'weak', near: [['defen*'], ['my']], within: 3, question: 'Is this an apology, or a defense?' },
  { id: 'counter_accusation', strength: 'weak', near: [YOU, ['do', 'did', 'does'], ['same', 'it', 'too']], within: 4, question: 'Is this a good moment to bring up their part?' },
  { id: 'counter_accusation', strength: 'weak', near: [YOU, ['never', 'not'], ['apolog*', 'sorry']], within: 4, question: 'Is this a good moment to bring up their part?' },
  { id: 'counter_accusation', strength: 'weak', near: ['look', 'what', YOU], within: 4, question: 'Is this a good moment to bring up their part?' },

  // ================= NORMAL: cancelling or dodging =================
  // "I was just trying to help", "I meant well", "my intentions were good"
  { id: 'intent_over_impact', strength: 'weak', near: ['i', ['only', 'just', 'simply', 'merely'], ['trying', 'tried', 'wanted', 'joking', 'kidding', 'helping', 'being', 'saying', 'looking', 'worried', 'concerned', 'meant']], within: 5, question: INTENT },
  { id: 'intent_over_impact', strength: 'weak', near: [['intent*', 'motive*'], ['good', 'pure', 'honest', 'nice', 'clear', 'was', 'were']], within: 3, question: INTENT },
  { id: 'intent_over_impact', strength: 'weak', near: [['meant', 'intended'], ['well', 'good']], within: 3, question: INTENT },
  // "I guess I'm sorry", "kind of sorry", "maybe I was a bit out of line"
  { id: 'hedging', strength: 'weak', near: [['guess', 'suppose', 'reckon', 'whatever', 'fine'], SORRY], within: 4, question: SOFTENS },
  { id: 'hedging', strength: 'weak', near: [['kind', 'sort', 'kinda', 'sorta', 'little', 'bit', 'somewhat', 'slightly', 'partly', 'maybe', 'perhaps', 'possibly'], SORRY], within: 3, question: SOFTENS },
  { id: 'hedging', strength: 'weak', near: [['maybe', 'perhaps'], 'i', ['was', 'am', 'may', 'might', 'could', 'should']], within: 4, question: SOFTENS },
  { id: 'hedging', strength: 'weak', near: [['little', 'bit', 'somewhat', 'slightly', 'kinda', 'kind', 'sort'], ['wrong', 'rude', 'harsh', 'out', 'mean', 'insensitive', 'unfair']], within: 3, question: SOFTENS },
  // "because I was tired", "the reason I", "you have to understand"
  { id: 'unprompted_explanation', strength: 'weak', near: [['because', 'reason'], ['i', 'we', 'my']], within: 3, question: REASON },
  { id: 'unprompted_explanation', strength: 'weak', near: [YOU, ['have', 'need', 'should', 'must', 'ought'], ['understand', 'realize', 'realise', 'see', 'know', 'remember']], within: 5, question: REASON },

  // ================= NORMAL: asking for something back =================
  { id: 'pressure', strength: 'weak', near: [YOU, ['have', 'need', 'should', 'must', 'ought', 'owe', 'supposed'], ['forgive', 'forgiveness']], within: 5, question: PRESSURE },
  { id: 'pressure', strength: 'weak', near: ['forgive', 'me', ['already', 'now', 'finally', 'just']], within: 4, question: PRESSURE },
  { id: 'pressure', strength: 'weak', near: ['are', 'we', ['good', 'cool', 'ok', 'okay', 'even']], within: 3, question: PRESSURE },
  { id: 'pressure', strength: 'weak', near: ['we', ['good', 'fine', 'cool'], 'now'], within: 4, question: PRESSURE },
  // "you should apologize too", "I'll say sorry once you do"
  { id: 'reciprocity', strength: 'weak', seq: [YOU, ['should', 'need', 'must', 'have', 'ought', 'will', 'supposed'], ['apolog*', 'sorry']], gap: 3, question: WAITS },
  { id: 'reciprocity', strength: 'weak', near: [['apolog*', 'sorry'], ['first', 'too', 'also', 'back'], YOU], within: 5, question: WAITS },
  { id: 'reciprocity', strength: 'weak', seq: ['i', 'will', ['apolog*', 'say', 'sorry'], ['if', 'when', 'once', 'after', 'until'], YOU], gap: 3, stop: FIRST, question: WAITS },
  // "let's move on", "can we just forget about it" ("I can't forget it" is about you, so "i" cancels it)
  { id: 'move_on', strength: 'weak', near: [['let', 'lets', 'can', 'could', 'shall'], ['move', 'moving', 'drop', 'forget', 'forgetting', 'bury', 'leave', 'put', 'stop'], ['on', 'it', 'this', 'that', 'past', 'behind', 'about', 'talking', 'arguing', 'fighting']], within: 6, unless: ['i', 'my'], question: RESPOND_FIRST },
  // "I'm such a failure", "I am the worst"
  { id: 'self_pity', strength: 'weak', near: ['i', ['am', 'be'], ['worst', 'worthless', 'useless', 'stupid', 'idiot', 'failure', 'loser', 'mess', 'disaster', 'garbage', 'trash', 'monster', 'disappointment']], within: 6, question: 'Does this ask them to reassure you? It may leave less room for how they feel.' },

  // ================= NORMAL: vague, excessive or unmoored =================
  { id: 'vague_apology', strength: 'weak', near: [SORRY, ['everything', 'anything', 'whatever']], within: 4, question: 'Can you name the specific thing?' },
  { id: 'repeated_sorry', strength: 'weak', near: [SORRY, SORRY], within: 5, question: 'Does the repetition add something? One clear "sorry" with what you did may carry more weight.' },
  // "I'll try to be better", "I promise to do better", "it won't happen again"
  { id: 'no_specifics_promise', strength: 'weak', near: ['i', ['try', 'trying', 'promise', 'swear', 'will', 'do', 'be'], ['better', 'harder', 'different', 'nicer', 'kinder', 'improve', 'change']], within: 9, question: CONCRETE },
  { id: 'no_specifics_promise', strength: 'weak', near: [['happen', 'happens', 'repeat'], 'again', ['not', 'never']], within: 5, question: CONCRETE },
  { id: 'absolute_promise', strength: 'weak', near: [['never', 'ever'], 'again'], within: 6, question: 'Can you keep a promise this big? A smaller, specific one may be easier to trust.' },
]
