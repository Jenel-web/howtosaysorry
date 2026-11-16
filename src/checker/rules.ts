import type { Rule } from './types'

// "strong" = red card, "weak" = normal card. Questions, never verdicts.
// Guards (skipBefore / skipAfter) keep harmless uses from being flagged.

// "sorry, but I can't make it" is a polite refusal, not an excuse.
// "I'm sorry. But I'd like to explain when you're ready" is an invitation.
const NOT_AN_EXCUSE =
  /^\s*(?:i\s+)?(?:can['’]?t\s+(?:make|come|attend|join|go|stay|meet|help)|cannot\s+(?:make|come|attend|join)|won['’]t\s+(?:be\s+able|make)|(?:have|need)\s+to\s+(?:cancel|go|leave|run|decline|reschedule|skip|bail|miss)|am\s+(?:not\s+able|unable)|i['’]m\s+(?:not\s+able|unable)|i['’]d\s+(?:like|love)\s+to\s+(?:talk|explain|hear|listen|share)|can\s+we|could\s+we|may\s+i)\b/i

// "I'm not saying you're overreacting" disclaims the word.
const NEGATED = /\b(?:not|n['’]t|never)\s+(?:saying|say|calling|implying|think(?:ing)?|suggesting)\b[^.!?]*$/i

const SOUNDS_LIKE_THEIR_REACTION = 'This can sound like the problem is their reaction. Can you name what you did?'

export const rules: Rule[] = [
  // ---------- Red: shifting the problem onto them ----------
  {
    id: 'sorry_you_feel',
    strength: 'strong',
    pattern: /\bsorry\s+(?:that\s+)?you\s+(?:feel|felt|are|were)\b/gi,
    question: SOUNDS_LIKE_THEIR_REACTION,
    // "sorry you're going through this" is sympathy, not an apology.
    skipAfter: /^\s*(?:going\s+through|dealing\s+with|sick|ill|in\s+pain|struggling|having\s+(?:a\s+)?(?:hard|tough|rough))/i,
  },
  {
    id: 'if_i_hurt',
    strength: 'strong',
    pattern:
      /\bif\s+i\s+(?:hurt|upset|offended|did\s+anything\s+wrong|said\s+something\s+wrong|made\s+you\s+feel)\b|\bif\s+you(?:['’]re|\s+(?:are|were|felt|feel))\s+(?:hurt|upset|offended|bothered)\b/gi,
    question: '"If" can sound like you doubt it happened. Can you say that it did?',
  },
  {
    id: 'took_it_that_way',
    strength: 'strong',
    pattern:
      /\byou\s+took\s+it\s+(?:that|this|the\s+wrong)\s+way\b|\bregret\b[^.!?]{0,30}?\b(?:misunderstood|misinterpreted|taken\s+(?:out\s+of\s+context|the\s+wrong\s+way))\b|\b(?:my\s+words|what\s+i\s+said)\s+(?:was|were)\s+(?:misunderstood|misinterpreted|taken\s+the\s+wrong\s+way)\b/gi,
    question: 'This may put the problem in how they heard it. Can you name what you said or did?',
  },
  {
    id: 'other_state',
    strength: 'strong',
    pattern:
      /\bsorry\s+(?:that\s+)?you(?:['’]re|\s+are|\s+were)\s+(?:so\s+|feeling\s+|being\s+so\s+)?(?:upset|angry|mad|hurt|offended|bothered|sensitive|annoyed)\b(?!\s+by\b)/gi,
    question: SOUNDS_LIKE_THEIR_REACTION,
  },
  {
    id: 'sorry_hurt_by',
    strength: 'weak',
    pattern: /\bsorry\s+(?:that\s+)?you(?:['’]re|\s+are|\s+were)\s+(?:hurt|bothered|upset|offended)\s+by\b/gi,
    question: 'This puts their reaction first. Can you name your own words or action?',
  },
  {
    id: 'blame_shift',
    strength: 'strong',
    pattern: /\byou\s+made\s+me\b|\bbecause\s+you\b|\byou\s+pushed\s+my\s+buttons\b/gi,
    question: 'This may shift the blame to them. Is that what you mean?',
  },
  {
    id: 'minimizing',
    strength: 'strong',
    pattern: /\boverreact(?:ing)?\b|\btoo\s+sensitive\b|\bcalm\s+down\b|\bjust\s+a\s+joke\b|\bnot\s+a\s+big\s+deal\b/gi,
    question: 'This may make their feelings seem small.',
    skipBefore: NEGATED,
  },
  {
    id: 'always_never',
    strength: 'strong',
    pattern: /\byou\s+(?:always|never)\b/gi,
    question: '"Always" and "never" can start a new argument. Is this about this one time?',
  },

  // ---------- Red: cancelling the apology or dodging the actor ----------
  {
    id: 'sorry_but',
    strength: 'strong',
    pattern: /\b(?:sorry|apologi[sz]e)\b(?:\W+\w+){0,5}?\W+but\b/gi,
    question: 'Does this "but" explain, or excuse?',
    skipAfter: NOT_AN_EXCUSE,
  },
  {
    id: 'agentless',
    strength: 'strong',
    pattern:
      /\bmistakes\s+(?:were|have\s+been)\s+made\b|\bthings\s+were\s+said\b|\bwords\s+were\s+exchanged\b|\bthere\s+was\s+a\s+(?:misunderstanding|miscommunication)\b|\bwhat\s+happened\s+happened\b/gi,
    question: 'Who made the mistake? Naming yourself can help this land.',
  },
  {
    id: 'sorry_not_sorry',
    strength: 'strong',
    pattern: /\bsorry,?\s+not\s+sorry\b|\bonly\s+sorry\s+(?:that\s+)?i\s+got\s+caught\b/gi,
    question: 'Does this say you mean the apology?',
  },
  {
    id: 'sarcasm',
    strength: 'strong',
    pattern: /\bsorry\s+for\s+(?:breathing|existing)\b|\bdid\s+i\s+hurt\s+your\s+feelings\b/gi,
    question: 'This may read as mocking. Is that what you want?',
  },
  {
    id: 'generic_audience',
    strength: 'strong',
    pattern:
      /\banyone\s+(?:who\s+)?(?:i\s+)?(?:may|might)\s+(?:have\s+)?(?:hurt|offended|upset|harmed)\b|\banyone\s+who\s+(?:may\s+have\s+been|was|felt)\s+(?:offended|hurt|upset)\b/gi,
    question: 'Who are you apologizing to? Naming them can matter.',
  },

  // ---------- Red: asking for something back ----------
  {
    id: 'forgiveness_demand',
    strength: 'strong',
    pattern:
      /\bwhat\s+more\s+(?:do\s+you\s+want|can\s+i\s+(?:do|say))\b|\bwhat\s+else\s+do\s+you\s+want\b|\bhow\s+many\s+times\s+do\s+i\s+have\s+to\s+(?:say|apologi[sz]e)\b|\bi\s+(?:already\s+)?said\s+(?:i['’]m\s+|i\s+was\s+)?sorry\b/gi,
    question: 'Forgiveness is theirs to give. Can you leave room for them to respond?',
  },

  // ---------- Normal: shifting the problem ----------
  {
    id: 'relitigating',
    strength: 'weak',
    pattern:
      /\bthat(?:['’]s|\s+is)\s+not\s+what\s+(?:really\s+)?happened\b|\byou['’]re\s+misremembering\b|\blet\s+me\s+explain\s+what\s+(?:really\s+)?happened\b/gi,
    question: 'Does this re-argue what happened? It may start the discussion again.',
  },
  {
    id: 'in_my_defense',
    strength: 'weak',
    pattern: /\bto\s+be\s+fair\b|\bin\s+my\s+defen[cs]e\b|\bit\s+takes\s+two\b/gi,
    question: 'Is this an apology, or a defense?',
  },
  {
    id: 'counter_accusation',
    strength: 'weak',
    pattern: /\byou\s+owe\s+me\s+(?:an\s+)?apology\b|\byou(?:['’]ve|\s+have)?\s+(?:also\s+)?(?:never|didn['’]t)\s+(?:apologi[sz]ed?|said\s+sorry)\b/gi,
    question: 'Is this a good moment to bring up their part?',
  },
  {
    id: 'backhanded',
    strength: 'weak',
    pattern: /\bsorry\s+(?:that\s+)?i['’]m\s+not\s+(?:as\s+|so\s+)?perfect\b/gi,
    question: 'Does this sound sarcastic?',
  },

  // ---------- Normal: cancelling or dodging ----------
  {
    id: 'loose_but',
    strength: 'weak',
    pattern: /\bbut\b/gi,
    question: 'Worth a second look?',
    skipAfter: NOT_AN_EXCUSE,
  },
  {
    id: 'regret_only',
    strength: 'weak',
    pattern: /\bi\s+regret\s+that\s+(?:this|it|that)\s+(?:happened|occurred)\b|\bunfortunately,?\s+(?:this|it|that)\s+(?:happened|occurred)\b/gi,
    question: 'Does this say what you did, or only that it happened?',
  },
  {
    id: 'intent_over_impact',
    strength: 'weak',
    pattern: /\bi\s+was\s+(?:only|just|simply)\s+trying\s+to\b|\bmy\s+intent(?:ion)?\s+(?:was|wasn['’]t)\b/gi,
    question: 'Does this lean on your intent more than on how it landed?',
  },
  {
    id: 'hedging',
    strength: 'weak',
    pattern:
      /\bi\s+guess\s+(?:i['’]m\s+sorry|i\s+was|i\s+am)\b|\bsorry,?\s+i\s+guess\b|\bmaybe\s+i\s+was\s+(?:a\s+(?:little|bit)\s+)?(?:wrong|out\s+of\s+line|too\s+\w+)\b|\b(?:kind|sort)\s+of\s+sorry\b|\ba\s+little\s+out\s+of\s+line\b/gi,
    question: 'Do the hedges soften what you own?',
  },
  {
    id: 'unprompted_explanation',
    strength: 'weak',
    pattern: /\bthe\s+reason\s+(?:i|why\s+i)\b|\bit['’]s\s+because\s+i\b|\bbecause\s+i\s+was\b/gi,
    question: 'Did they ask for the reason? It may land better after they have heard the apology.',
  },
  {
    id: 'corporate_wording',
    strength: 'weak',
    pattern:
      /\bany\s+(?:inconvenience|offen[cs]e|distress)\s+(?:this\s+)?(?:may\s+have\s+)?caused\b|\bwe\s+regret\b|\bwe\s+take\s+(?:this|your\s+concerns?)\s+(?:very\s+)?seriously\b/gi,
    question: 'This reads like a statement to a crowd. Who are you apologizing to?',
  },

  // ---------- Normal: asking for something back ----------
  {
    id: 'pressure',
    strength: 'weak',
    pattern:
      /\bforgive\s+me\s+already\b|\bso\s+we['’]?re\s+good\b|\bare\s+we\s+good\b|\byou\s+have\s+to\s+forgive\b/gi,
    question: 'Asking for forgiveness right away can feel like pressure.',
  },
  {
    id: 'reciprocity',
    strength: 'weak',
    pattern:
      /\bi['’]ll\s+(?:apologi[sz]e|say\s+sorry)\s+(?:if|when|once|after)\s+you\b|\bnow\s+you\s+(?:say\s+sorry|apologi[sz]e)\b|\byour\s+turn\s+to\s+apologi[sz]e\b/gi,
    question: 'Does this wait on them apologizing first?',
  },
  {
    id: 'move_on',
    strength: 'weak',
    pattern:
      /\blet['’]?s\s+(?:just\s+)?(?:move\s+on|drop\s+it|forget\s+(?:it|about\s+it)|put\s+(?:it|this)\s+behind\s+us)\b|\bcan\s+we\s+(?:just\s+)?(?:move\s+on|drop\s+it|forget\s+(?:it|about\s+it))\b|\bwater\s+under\s+the\s+bridge\b|\bforget\s+it\b/gi,
    question: 'Have they had a chance to respond first?',
  },
  {
    id: 'self_pity',
    strength: 'weak',
    pattern:
      /\bi['’]m\s+such\s+a\s+(?:bad|terrible|horrible|awful)\s+\w+\b|\bi\s+hate\s+myself\b|\byou\s+know\s+how\s+hard\s+(?:this|it)\s+is\s+for\s+me\b|\bi['’]m\s+the\s+worst\b/gi,
    question: 'Does this ask them to reassure you? It may leave less room for how they feel.',
  },
  {
    id: 'apology_for_a_trade',
    strength: 'weak',
    pattern: /\bif\s+you\s+forgive\s+me,?\s+(?:we\s+can|then)\b|\bcan\s+we\s+(?:just\s+)?go\s+back\s+to\s+(?:normal|how\s+(?:things|we)\s+were)\b/gi,
    question: 'Is this apology tied to something you want back? It may read as a trade.',
  },
  {
    id: 'fake_gratitude',
    strength: 'weak',
    pattern: /\bthank(?:s|\s+you)\s+for\s+putting\s+up\s+with\s+me\b|\bthanks\s+for\s+being\s+so\s+understanding\s+as\s+always\b/gi,
    question: 'Does this thank them, or skip owning it?',
  },

  // ---------- Normal: vague, excessive or unmoored ----------
  {
    id: 'vague_apology',
    strength: 'weak',
    pattern: /\b(?:sorry|apologi[sz]e)\s+(?:for|about)\s+(?:everything|whatever(?:\s+i\s+did)?|all\s+of\s+it|it\s+all|all\s+that)\b/gi,
    question: 'Can you name the specific thing?',
  },
  {
    id: 'repeated_sorry',
    strength: 'weak',
    pattern: /\b(?:so\s+so|really,?\s+really|very,?\s+very)\s+sorry\b|\bsorry,?\s+sorry\b|\bplease,?\s+please\b/gi,
    question: 'Does the repetition add something? One clear "sorry" with what you did may carry more weight.',
  },
  {
    id: 'no_specifics_promise',
    strength: 'weak',
    pattern:
      /\bi['’]ll\s+try\s+(?:to\s+)?(?:do\s+better|be\s+better|harder)\b|\b(?:it|this)\s+(?:won['’]t|will\s+not)\s+happen\s+again\b|\bi['’]ll\s+(?:do\s+better|be\s+better|change)\b/gi,
    question: 'What will you do differently? A concrete step may land better.',
  },
  {
    id: 'absolute_promise',
    strength: 'weak',
    pattern:
      /\bnever\s+(?:do|say|let)\s+(?:that|it|this)\s+(?:again|happen)\b|\bnever\s+happen\s+again\b|\bnever\s+again\b/gi,
    question: 'Can you keep a promise this big? A smaller, specific one may be easier to trust.',
  },
]
