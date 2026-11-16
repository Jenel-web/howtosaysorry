import type { Rule } from './types'

// "strong" = red card, "weak" = normal card. Questions, never verdicts.
// Each pattern lists many ways of saying the same thing. Guards (skipBefore /
// skipAfter) keep harmless uses from being flagged.

// "sorry, but I can't make it" is a polite refusal, not an excuse.
// "I'm sorry. But I'd like to explain when you're ready" is an invitation.
const NOT_AN_EXCUSE =
  /^\s*(?:i\s+)?(?:can['’]?t\s+(?:make|come|attend|join|go|stay|meet|help)|cannot\s+(?:make|come|attend|join)|won['’]t\s+(?:be\s+able|make)|(?:have|need)\s+to\s+(?:cancel|go|leave|run|decline|reschedule|skip|bail|miss)|am\s+(?:not\s+able|unable)|i['’]m\s+(?:not\s+able|unable)|i['’]d\s+(?:like|love)\s+to\s+(?:talk|explain|hear|listen|share)|can\s+we|could\s+we|may\s+i|let['’]s\s+(?:reschedule|talk|meet|try|catch|figure|discuss|find|plan))\b/i

// "I'm not saying you're overreacting" disclaims the word.
const NEGATED = /\b(?:not|n['’]t|never)\s+(?:saying|say|calling|implying|think(?:ing)?|suggesting)\b[^.!?]*$/i

// "sorry you're going through this" is sympathy, not an apology.
const SYMPATHY =
  /^\s*(?:going\s+through|dealing\s+with|sick|ill|injured|in\s+pain|struggling|stuck|laid\s+off|fired|been\s+through|had\s+to\s+(?:go|deal|see|hear|witness)|having\s+(?:a\s+)?(?:hard|tough|rough|bad))/i

const SOUNDS_LIKE_THEIR_REACTION = 'This can sound like the problem is their reaction. Can you name what you did?'

// Words for "I apologize" that people use before an excuse.
const SORRY_WORDS = 'sorry|apologi[sz]e|apologi[sz]ing|my\\s+apologies|forgive\\s+me|regret|my\\s+bad|my\\s+fault|i\\s+was\\s+wrong|i\\s+messed\\s+up'
// Words that turn an apology around, like "but".
const TURN_WORDS = 'but|however|although|though|except|nevertheless|nonetheless|that\\s+said|even\\s+so'

export const rules: Rule[] = [
  // ---------- Red: shifting the problem onto them ----------
  {
    id: 'sorry_you_feel',
    strength: 'strong',
    pattern:
      /\b(?:sorry|apologi[sz]e|regret)\s+(?:that\s+)?you\s+(?:feel|felt|are|were|think|thought|got|seem(?:ed)?|find|found|have\s+been)\b|\b(?:sorry|apologi[sz]e|regret)\s+(?:that\s+)?you(?:['’]re|\s+are)\s+feeling\s+(?:this|that|the)\s+way\b|\bsorry\s+to\s+hear\s+(?:that\s+)?you\s+(?:feel|felt|think|thought)\b/gi,
    question: SOUNDS_LIKE_THEIR_REACTION,
    skipAfter: SYMPATHY,
  },
  {
    id: 'if_i_hurt',
    strength: 'strong',
    pattern: new RegExp(
      '\\bif\\s+(?:i|my\\s+(?:words|actions|behavio(?:u)?r|tone|joke|comment)|what\\s+i\\s+(?:said|did)|anything\\s+i\\s+(?:said|did))\\s+(?:may\\s+have\\s+|might\\s+have\\s+|could\\s+have\\s+|have\\s+|had\\s+)?' +
        '(?:hurt|upset|offended|offend|insult(?:ed)?|bother(?:ed)?|annoy(?:ed)?|anger(?:ed)?|disappoint(?:ed)?|let\\s+you\\s+down|made\\s+you\\s+feel|crossed\\s+a\\s+line|did\\s+(?:anything|something)\\s+wrong|said\\s+(?:anything|something)\\s+(?:wrong|hurtful)|was\\s+wrong)\\b' +
        '|\\bif\\s+you(?:[\'’]re|\\s+(?:are|were|felt|feel))\\s+(?:hurt|upset|offended|bothered|insulted|disrespected|uncomfortable)\\b' +
        '|\\bif\\s+you\\s+took\\s+(?:it|that|this|offen[cs]e)\\b' +
        '|\\bif\\s+(?:it|that|this)\\s+(?:hurt|upset|offended|bothered)\\b',
      'gi',
    ),
    question: '"If" can sound like you doubt it happened. Can you say that it did?',
  },
  {
    id: 'took_it_that_way',
    strength: 'strong',
    pattern:
      /\byou\s+(?:took|read|heard|saw|interpreted|understood|perceived)\s+(?:it|that|this|what\s+i\s+(?:said|meant|did))\s+(?:that|this|the\s+wrong|in\s+that)\s+way\b|\byou\s+(?:took\s+(?:it|that|this)\s+personally|took\s+offen[cs]e|misunderstood|misread|misinterpreted|misconstrued)\b|\b(?:regret|sorry)\b[^.!?]{0,30}?\b(?:misunderstood|misinterpreted|misconstrued|misread|taken\s+(?:out\s+of\s+context|the\s+wrong\s+way|wrongly|that\s+way))\b|\b(?:my\s+(?:words|comment|message|joke|tone)|what\s+i\s+(?:said|meant))\s+(?:was|were)\s+(?:misunderstood|misinterpreted|misconstrued|taken\s+(?:out\s+of\s+context|the\s+wrong\s+way|wrongly|that\s+way))\b/gi,
    question: 'This may put the problem in how they heard it. Can you name what you said or did?',
  },
  {
    id: 'other_state',
    strength: 'strong',
    pattern:
      /\b(?:sorry|apologi[sz]e|regret)\s+(?:that\s+)?you(?:['’]re|\s+are|\s+were|\s+got|\s+have\s+been)\s+(?:(?:so|really|very)\s+)?(?:(?:feeling|being|acting)\s+)?(?:(?:so|really|very)\s+)?(?:upset|angry|mad|hurt|offended|bothered|sensitive|annoyed|insulted|triggered|emotional|dramatic|touchy|defensive|irritated|furious|disappointed|uncomfortable)\b(?!\s+by\b)/gi,
    question: SOUNDS_LIKE_THEIR_REACTION,
  },
  {
    id: 'sorry_hurt_by',
    strength: 'weak',
    pattern: /\b(?:sorry|apologi[sz]e|regret)\s+(?:that\s+)?you(?:['’]re|\s+are|\s+were)\s+(?:hurt|bothered|upset|offended|insulted|angry)\s+by\b/gi,
    question: 'This puts their reaction first. Can you name your own words or action?',
  },
  {
    id: 'blame_shift',
    strength: 'strong',
    pattern:
      /\byou\s+(?:made|make|forced|provoked|triggered|pushed)\s+me\b|\byou\s+drove\s+me\s+to\s+(?:it|this|do|the\s+edge|anger|snap|crazy)\b|\byou\s+(?:left|gave)\s+me\s+no\s+(?:choice|option|other\s+option)\b|\byou\s+set\s+me\s+off\b|\bbecause\s+(?:you|of\s+what\s+you)\b|\byou\s+pushed\s+my\s+buttons\b|(?<!\bnot\s)(?<!n['’]t\s)\byour\s+fault\b|\bthis\s+is\s+on\s+you\b|\bi\s+blame\s+you\b|\byou\s+(?:caused|started|brought)\s+(?:this|it|all\s+this)\b|\byou\s+(?:were\s+)?asked\s+for\s+it\b|\byou\s+(?:were|are)\s+asking\s+for\s+it\b|\byou\s+brought\s+this\s+on\s+yourself\b|\byou['’]re\s+the\s+reason\s+(?:i|we|this)\b|\bif\s+you\s+(?:hadn['’]t|had\s+not)\b/gi,
    question: 'This may shift the blame to them. Is that what you mean?',
  },
  {
    id: 'minimizing',
    strength: 'strong',
    pattern:
      /\bover-?react(?:ing|ed|s)?\b|\b(?:too|so|over|overly|being)\s+sensitive\b|\boversensitive\b|\b(?:being|so)\s+dramatic\b|\bdrama\s+queen\b|\bcalm\s+down\b|\bchill\s+out\b|\bget\s+over\s+it\b|\bget\s+a\s+grip\b|\blighten\s+up\b|\bjust\s+(?:a\s+joke|joking|kidding)\b|\bonly\s+(?:a\s+joke|joking|kidding)\b|\bwas\s+(?:only\s+|just\s+)?(?:joking|kidding)\b|\bit\s+was\s+a\s+joke\b|\bcan['’]?t\s+(?:you\s+)?take\s+a\s+joke\b|\b(?:not\s+a|no)\s+big\s+deal\b|\bnot\s+that\s+big\s+of\s+a\s+deal\b|\bno\s+biggie\b|\bit['’]s\s+nothing\b|\bnot\s+that\s+(?:bad|serious)\b|\bjust\s+words\b|\bblow(?:ing)?\s+(?:it|this|things)\s+out\s+of\s+proportion\b|\bmountain\s+out\s+of\s+a\s+molehill\b|\b(?:making|make)\s+a\s+(?:big\s+)?(?:deal|scene)\s+(?:out\s+)?of\s+(?:it|this|nothing)\b|\byou['’]re\s+being\s+(?:ridiculous|irrational|crazy|petty|silly|childish)\b|\bdon['’]t\s+take\s+it\s+so\s+(?:seriously|personally)\b|\bget\s+over\s+yourself\b/gi,
    question: 'This may make their feelings seem small.',
    skipBefore: NEGATED,
  },
  {
    id: 'always_never',
    strength: 'strong',
    pattern:
      /\byou(?:['’]re|\s+are)?\s+(?:always|never|constantly|forever|continually|perpetually)\b|\byou\s+(?:keep|kept)\s+(?:on\s+)?\w+ing\b|\bevery\s+(?:single\s+)?time\s+you\b|\byou\s+can\s+never\b|\byou\s+(?:just\s+)?(?:don['’]t|do\s+not)\s+ever\b|\bnot\s+once\s+have\s+you\b/gi,
    question: '"Always" and "never" can start a new argument. Is this about this one time?',
  },

  // ---------- Red: cancelling the apology or dodging the actor ----------
  {
    id: 'sorry_but',
    strength: 'strong',
    pattern: new RegExp(`\\b(?:${SORRY_WORDS})\\b(?:\\W+\\w+){0,5}?\\W+(?:${TURN_WORDS})\\b`, 'gi'),
    question: 'Does this "but" explain, or excuse?',
    skipAfter: NOT_AN_EXCUSE,
  },
  {
    id: 'agentless',
    strength: 'strong',
    pattern:
      /\b(?:mistakes?|errors?|missteps?)\s+(?:was|were|have\s+been|has\s+been|occurred|happened)(?:\s+made)?\b|\blapse\s+in\s+judg(?:e)?ment\b|\bthings\s+(?:were\s+said|got\s+(?:said|heated|out\s+of\s+hand|ugly|blown\s+out\s+of\s+proportion)|escalated|went\s+(?:too\s+far|south|wrong))\b|\btempers\s+flared\b|\bwords\s+were\s+(?:exchanged|said)\b|\bit\s+(?:just\s+)?(?:happened|got\s+out\s+of\s+hand)\b|\bthe\s+situation\s+(?:got|became|escalated|went)\b|\bthere\s+was\s+a\s+(?:misunderstanding|miscommunication|mix-?up|disagreement|breakdown)\b|\bwhat\s+happened\s+happened\b|\b(?:unfortunate|regrettable)\s+(?:incident|situation|event|misunderstanding)\b/gi,
    question: 'Who made the mistake? Naming yourself can help this land.',
  },
  {
    id: 'sorry_not_sorry',
    strength: 'strong',
    pattern:
      /\bsorry,?\s+not\s+sorry\b|\b(?:i['’]m\s+)?not\s+(?:even\s+|really\s+|actually\s+)?sorry\b|\b(?:only\s+)?sorry\s+(?:that\s+)?(?:i\s+got\s+caught|you\s+(?:caught\s+me|found\s+out|saw|noticed))\b|\bsorry\s+for\s+getting\s+caught\b/gi,
    question: 'Does this say you mean the apology?',
  },
  {
    id: 'sarcasm',
    strength: 'strong',
    pattern:
      /\bsorry\s+for\s+(?:breathing|existing|being\s+(?:alive|human|born|me|honest|right|real)|having\s+(?:feelings|an\s+opinion)|caring|trying)\b|\bdid\s+i\s+(?:hurt\s+your\s+feelings|offend\s+you|upset\s+you)\b|\b(?:well,?\s+)?(?:excuse|pardon)\s+me\s+(?:for\s+)?(?:being|having|caring|existing|breathing)\b|\bsorry,?\s+(?:your\s+)?(?:highness|majesty)\b|\bpoor\s+(?:baby|you)\b|\bboo\s*hoo\b|\bsorry\s+you\s+can['’]t\s+take\s+a\s+joke\b/gi,
    question: 'This may read as mocking. Is that what you want?',
  },
  {
    id: 'generic_audience',
    strength: 'strong',
    pattern:
      /\b(?:anyone|anybody|everyone|everybody|whoever|all\s+those|those)\s+(?:(?:who|that)\s+)?(?:i\s+)?(?:may|might|could)\s+(?:possibly\s+)?(?:have\s+)?(?:hurt|offended|upset|harmed|wronged|affected|let\s+down|been\s+(?:offended|hurt|upset|affected))\b|\b(?:anyone|anybody|whoever|those)\s+(?:who\s+)?(?:was|were|felt|is|got)\s+(?:offended|hurt|upset|harmed|affected)\b|\bif\s+(?:anyone|anybody|someone)\s+(?:was|got|felt|is)\b|\banyone\s+(?:affected|offended|hurt)\b|\bto\s+those\s+(?:offended|hurt|affected)\b/gi,
    question: 'Who are you apologizing to? Naming them can matter.',
  },

  // ---------- Red: asking for something back ----------
  {
    id: 'forgiveness_demand',
    strength: 'strong',
    pattern:
      /\bwhat\s+(?:more|else)\s+(?:do\s+you\s+want|can\s+i\s+(?:do|say))\b|\bwhat\s+do\s+you\s+want\s+me\s+to\s+(?:do|say)\b|\bhow\s+many\s+times\s+(?:do\s+i\s+have\s+to|must\s+i)\s+(?:say|apologi[sz]e|tell\s+you)\b|\bhow\s+(?:long|much\s+longer)\s+(?:are\s+you\s+going\s+to|will\s+you)\s+(?:stay\s+mad|be\s+mad|hold\s+this|punish\s+me|ignore\s+me)\b|\bi\s+(?:already\s+)?(?:said|told\s+you)\s+(?:that\s+)?(?:i['’]m\s+|i\s+was\s+)?sorry\b|\bi\s+already\s+apologi[sz]ed\b|\bi['’]ve\s+(?:already\s+)?(?:apologi[sz]ed|said\s+sorry)\b|\bisn['’]t\s+(?:that|it)\s+enough\b|\bthat\s+should\s+be\s+enough\b|\bjust\s+forgive\s+me\b|\bforgive\s+and\s+forget\b|\bstop\s+(?:being\s+mad|holding\s+(?:it|this)\s+against\s+me|punishing\s+me|giving\s+me\s+the\s+silent\s+treatment)\b|\b(?:say|tell\s+me)\s+(?:that\s+)?you\s+forgive\s+me\b/gi,
    question: 'Forgiveness is theirs to give. Can you leave room for them to respond?',
  },

  // ---------- Normal: shifting the problem ----------
  {
    id: 'relitigating',
    strength: 'weak',
    pattern:
      /\bthat(?:['’]s\s+not|\s+is\s+not|\s+isn['’]t|\s+wasn['’]t|\s+was\s+not)\s+(?:what|how)\s+(?:really\s+|actually\s+)?(?:it\s+)?(?:happened|i\s+said|you\s+said|went\s+down)\b|\bi\s+(?:never|didn['’]t)\s+(?:actually\s+)?(?:say|said)\s+that\b|\byou(?:['’]re|\s+are)\s+(?:misremembering|remembering\s+it\s+wrong|exaggerating|lying)\b|\byou\s+(?:remember|got)\s+it\s+wrong\b|\byou(?:['’]re|\s+are)?\s+twist(?:ed|ing)\s+my\s+words\b|\blet\s+me\s+(?:explain|set\s+the\s+record\s+straight\s+on)\s+what\s+(?:really\s+|actually\s+)?happened\b|\bwhat\s+really\s+happened\b|\bfor\s+the\s+record\b|\bset\s+the\s+record\s+straight\b|\bthe\s+(?:real|whole)\s+(?:story|truth)\b/gi,
    question: 'Does this re-argue what happened? It may start the discussion again.',
  },
  {
    id: 'in_my_defense',
    strength: 'weak',
    pattern:
      /\bto\s+be\s+fair\b|\bin\s+(?:my\s+defen[cs]e|fairness)\b|\bit\s+takes\s+two\b|\bnot\s+(?:to\s+make\s+excuses|making\s+excuses|trying\s+to\s+make\s+excuses)\b|\bi['’]m\s+not\s+(?:making|trying\s+to\s+make)\s+excuses\b/gi,
    question: 'Is this an apology, or a defense?',
  },
  {
    id: 'counter_accusation',
    strength: 'weak',
    pattern:
      /\byou\s+owe\s+me\s+(?:an\s+)?apology\b|\byou(?:['’]ve|\s+have)?\s+(?:also\s+)?(?:never|didn['’]t)\s+(?:apologi[sz]ed?|said\s+sorry)\b|\byou\s+(?:also\s+)?(?:do|did)\s+(?:the\s+same|it\s+too)\b|\byou['’]re\s+(?:not\s+(?:perfect|innocent|a\s+saint)|no\s+(?:better|saint|angel)|just\s+as\s+bad)\b|\bwhat\s+about\s+(?:the\s+time|when)\s+you\b|\byou\s+started\s+it\b|\blook\s+at\s+what\s+you\b/gi,
    question: 'Is this a good moment to bring up their part?',
  },
  {
    id: 'backhanded',
    strength: 'weak',
    pattern:
      /\bsorry\s+(?:that\s+)?(?:i['’]m|i\s+am)\s+(?:not\s+(?:as\s+|so\s+)?(?:perfect|a\s+mind[\s-]?reader|a\s+saint|like\s+you)|only\s+human|human)\b|\bsorry\s+(?:i\s+can['’]t\s+be\s+perfect|for\s+not\s+being\s+perfect)\b/gi,
    question: 'Does this sound sarcastic?',
  },

  // ---------- Normal: cancelling or dodging ----------
  {
    id: 'loose_but',
    strength: 'weak',
    pattern: /\b(?:but|however|although|even\s+though|nevertheless|nonetheless|that\s+said)\b/gi,
    question: 'Worth a second look?',
    skipAfter: NOT_AN_EXCUSE,
  },
  {
    id: 'regret_only',
    strength: 'weak',
    pattern:
      /\bi\s+regret\s+(?:that\s+)?(?:this|it|that|what)\s+(?:happened|occurred|came\s+to\s+this)\b|\bi\s+regret\s+the\s+(?:situation|incident|misunderstanding|whole\s+thing)\b|\bunfortunately,?\s+(?:this|it|that)\s+(?:happened|occurred)\b|\bit['’]s\s+(?:unfortunate|regrettable|a\s+shame)\s+that\b|\bi\s+wish\s+(?:this|it|that)\s+(?:hadn['’]t|had\s+not)\s+(?:happened|come\s+to\s+this)\b|\bsorry\s+(?:that\s+)?(?:this|it|that|things)\s+(?:happened|came\s+to\s+this|got\s+(?:this\s+)?(?:bad|far|heated))\b|\bsorry\s+about\s+(?:the\s+situation|what\s+happened|all\s+this)\b/gi,
    question: 'Does this say what you did, or only that it happened?',
  },
  {
    id: 'intent_over_impact',
    strength: 'weak',
    pattern:
      /\bi\s+was\s+(?:only|just|simply|merely)\s+(?:trying\s+to|being|joking|kidding|saying|doing|looking\s+out|helping|worried|concerned)\b|\bmy\s+(?:intent(?:ion)?s?|motives?)\s+(?:was|were|wasn['’]t|weren['’]t|is|are)\b|\bi\s+meant\s+well\b|\bi\s+had\s+(?:good|the\s+best)\s+intentions\b|\bi\s+thought\s+i\s+was\s+(?:helping|being\s+(?:nice|helpful))\b|\ball\s+i\s+(?:did|wanted)\s+was\b/gi,
    question: 'Does this lean on your intent more than on how it landed?',
  },
  {
    id: 'hedging',
    strength: 'weak',
    pattern:
      /\bi\s+(?:guess|suppose|reckon)\s+(?:i['’]m\s+sorry|i\s+was|i\s+am|i\s+should\s+(?:say|apologi[sz]e))\b|\bsorry,?\s+(?:i\s+)?(?:guess|suppose|whatever)\b|\b(?:fine|whatever),?\s+(?:i['’]m\s+|i\s+am\s+)?sorry\b|\bhappy\s+now\b|\b(?:maybe|perhaps)\s+i\s+(?:was|am|may\s+have\s+been|might\s+have\s+been)\b|\bi\s+(?:may|might|could)\s+have\s+been\s+(?:a\s+(?:little|bit)|somewhat|slightly|kind\s+of|sort\s+of)\b|\bi\s+was\s+(?:a\s+(?:little|bit)|somewhat|slightly|kind\s+of|sort\s+of|kinda)\s+(?:wrong|rude|harsh|out\s+of\s+line|insensitive|mean|unfair)\b|\b(?:a\s+little|a\s+bit|somewhat|slightly|kinda|kind\s+of|sort\s+of|sorta)\s+(?:sorry|out\s+of\s+line|wrong)\b/gi,
    question: 'Do the hedges soften what you own?',
  },
  {
    id: 'unprompted_explanation',
    strength: 'weak',
    pattern:
      /\bthe\s+reason\s+(?:i|why\s+i|is)\b|\bit['’]s\s+because\s+i\b|\bbecause\s+i\s+was\b|\bwhat\s+happened\s+was\b|\bthe\s+thing\s+is\b|\bhere['’]s\s+(?:what\s+happened|the\s+thing)\b|\bi\s+(?:was|had\s+been)\s+(?:having|going\s+through)\s+(?:a\s+)?(?:bad|rough|hard|tough|lot)\b|\bi\s+had\s+a\s+(?:bad|rough|long|hard)\s+day\b|\bi\s+was\s+under\s+(?:a\s+lot\s+of\s+)?(?:stress|pressure)\b|\byou\s+(?:have\s+to|need\s+to|should|must)\s+understand\b|\bput\s+yourself\s+in\s+my\s+(?:shoes|position)\b|\byou\s+don['’]t\s+know\s+what\s+i['’]m\s+going\s+through\b/gi,
    question: 'Did they ask for the reason? It may land better after they have heard the apology.',
  },
  {
    id: 'corporate_wording',
    strength: 'weak',
    pattern:
      /\bany\s+(?:inconvenience|offen[cs]e|distress|confusion|disruption|trouble|harm|hurt)\s+(?:this\s+|that\s+)?(?:may\s+have\s+|might\s+have\s+|has\s+|have\s+)?(?:caused|been\s+caused)\b|\bwe\s+(?:deeply\s+|sincerely\s+)?regret\b|\bwe\s+take\s+(?:this|your\s+(?:concerns?|feedback)|the\s+matter)\s+(?:very\s+)?seriously\b|\blessons\s+(?:will\s+be|have\s+been)\s+learned\b|\bwe\s+value\s+your\b/gi,
    question: 'This reads like a statement to a crowd. Who are you apologizing to?',
  },

  // ---------- Normal: asking for something back ----------
  {
    id: 'pressure',
    strength: 'weak',
    pattern:
      /\bforgive\s+me\s+already\b|\bso\s+we['’]?re\s+good\b|\bare\s+we\s+(?:good|cool|ok(?:ay)?)\b|\bwe['’]re\s+good\s+now\b|\bcan\s+we\s+be\s+friends\s+again\b|\bare\s+you\s+(?:still\s+mad|still\s+angry|done\s+being\s+mad)\b|\byou\s+(?:have\s+to|need\s+to|should|must)\s+forgive\b/gi,
    question: 'Asking for forgiveness right away can feel like pressure.',
  },
  {
    id: 'reciprocity',
    strength: 'weak',
    pattern:
      /\bi(?:['’]ll|\s+will)\s+(?:apologi[sz]e|say\s+sorry)\s+(?:if|when|once|after|only\s+if)\s+you\b|\bonly\s+if\s+you\s+(?:also\s+)?(?:apologi[sz]e|say\s+sorry)\b|\bnow\s+you\s+(?:say\s+sorry|apologi[sz]e)\b|\byour\s+turn\s+to\s+(?:apologi[sz]e|say\s+sorry)\b|\byou\s+(?:should|need\s+to|have\s+to|must)\s+(?:also\s+|too\s+)?(?:apologi[sz]e|say\s+sorry)\b|\byou\s+apologi[sz]e\s+first\b|\bapologi[sz]e\s+to\s+me\s+first\b|\bwe\s+both\s+(?:need\s+to|owe|should)\b|\bwhen\s+are\s+you\s+going\s+to\s+(?:apologi[sz]e|say\s+sorry)\b/gi,
    question: 'Does this wait on them apologizing first?',
  },
  {
    id: 'move_on',
    strength: 'weak',
    pattern:
      /\blet['’]?s\s+(?:just\s+)?(?:move\s+on|drop\s+it|forget\s+(?:it|about\s+it|this)|put\s+(?:it|this|that)\s+behind\s+us|leave\s+it|let\s+it\s+go|move\s+past\s+(?:it|this)|get\s+past\s+(?:it|this))\b|\bcan\s+we\s+(?:just\s+)?(?:move\s+on|drop\s+it|forget\s+(?:it|about\s+it|this)|stop\s+(?:talking|arguing|fighting)\s+about|not\s+talk\s+about|put\s+(?:it|this)\s+behind)\b|\bwater\s+under\s+the\s+bridge\b|(?<=(?:^|[.!?,]\s*|\b(?:just|please|oh|okay|ok|so|and)\s+))forget\s+(?:it|about\s+it)\b|\bnever\s*mind\b|\blet\s+it\s+go\b|\bbury\s+the\s+hatchet\b|\b(?:it['’]s|that['’]s)\s+(?:all\s+)?in\s+the\s+past\b|\bwhat['’]s\s+done\s+is\s+done\b|\bstop\s+(?:bringing\s+(?:it|this)\s+up|dwelling)\b/gi,
    question: 'Have they had a chance to respond first?',
  },
  {
    id: 'self_pity',
    strength: 'weak',
    pattern:
      /\bi(?:['’]m|\s+am)\s+(?:such\s+)?an?\s+(?:bad|terrible|horrible|awful|worthless|useless|stupid|total|complete)\s+(?:person|friend|partner|husband|wife|boyfriend|girlfriend|daughter|son|mother|father|parent|human|man|woman|brother|sister|employee|coworker|idiot|mess|failure|jerk)\b|\bi(?:['’]m|\s+am)\s+(?:the\s+worst|worthless|useless|a\s+(?:failure|mess|loser|disappointment|screw-?up)|an\s+idiot|so\s+(?:stupid|dumb|useless)|the\s+problem|toxic|trash)\b|\bi\s+hate\s+myself\b|\bi\s+(?:can['’]t|won['’]t|will\s+never)\s+(?:ever\s+)?forgive\s+myself\b|\bi\s+(?:don['’]t|do\s+not)\s+deserve\s+(?:you|to\s+be\s+forgiven|your\s+forgiveness)\b|\byou['’]d\s+be\s+better\s+off\s+without\s+me\b|\bi\s+ruin\s+everything\b|\byou\s+know\s+how\s+hard\s+(?:this|it)\s+is\s+for\s+me\b|\bthis\s+is\s+(?:so\s+|really\s+)?hard\s+for\s+me\b(?!\s+to\b)|\bthis\s+is\s+killing\s+me\b|\bi\s+can['’]t\s+(?:eat|sleep|live\s+without\s+you|go\s+on)\b|\bi['’]ve\s+been\s+crying\b|\bi\s+cried\s+all\s+night\b/gi,
    question: 'Does this ask them to reassure you? It may leave less room for how they feel.',
  },
  {
    id: 'apology_for_a_trade',
    strength: 'weak',
    pattern:
      /\bif\s+you\s+(?:forgive\s+me|take\s+me\s+back|give\s+me\s+another\s+chance),?\s+(?:we\s+can|then|i['’]ll|i\s+will|i\s+promise)\b|\bcan\s+(?:we|things)\s+(?:just\s+)?(?:go|get)\s+back\s+to\s+(?:normal|how\s+(?:things|we)\s+were|the\s+way\s+(?:things|we)\s+were)\b|\bcan\s+we\s+be\s+(?:friends|together|ok(?:ay)?)\s+again\b|\b(?:please\s+)?take\s+me\s+back\b|\bin\s+exchange\s+for\b/gi,
    question: 'Is this apology tied to something you want back? It may read as a trade.',
  },
  {
    id: 'fake_gratitude',
    strength: 'weak',
    pattern:
      /\bthank(?:s|\s+you)\s+(?:so\s+much\s+)?for\s+(?:always\s+)?(?:putting\s+up\s+with|tolerating|dealing\s+with|bearing\s+with|enduring)\s+me\b|\bthank(?:s|\s+you)\s+for\s+(?:always\s+)?being\s+so\s+(?:understanding|patient|forgiving|kind|nice)\s+(?:as\s+always|with\s+me|about\s+(?:me|this|it))\b|\bthank(?:s|\s+you)\s+for\s+always\s+(?:being\s+(?:so\s+)?(?:understanding|patient|forgiving)|forgiving\s+me)\b|\bthanks\s+for\s+nothing\b|\bthanks\s+for\s+being\s+the\s+bigger\s+person\b/gi,
    question: 'Does this thank them, or skip owning it?',
  },

  // ---------- Normal: vague, excessive or unmoored ----------
  {
    id: 'vague_apology',
    strength: 'weak',
    pattern:
      /\b(?:sorry|apologi[sz]e(?:\s+profusely)?)\s+(?:for|about)\s+(?:absolutely\s+|literally\s+)?(?:everything|anything|whatever|all\s+(?:of\s+it|that|this|the\s+(?:trouble|pain|hurt|mess|things?)|my\s+mistakes|i['’]ve\s+(?:done|put\s+you\s+through))|any\s+(?:hurt|pain|trouble|harm|upset)|it\s+all|the\s+whole\s+thing|the\s+mess|what\s+i\s+did)\b/gi,
    question: 'Can you name the specific thing?',
  },
  {
    id: 'repeated_sorry',
    strength: 'weak',
    pattern:
      /\b(so|really|very|truly|deeply|terribly|extremely)(?:,?\s+\1)+,?\s+(?:so\s+)?sorry\b|\bsorry,?\s+sorry\b|\bplease,?\s+please\b|\bi['’]m\s+begging\s+you\b|\bi\s+beg\s+(?:you|of\s+you)\b|\bon\s+my\s+(?:hands\s+and\s+)?knees\b/gi,
    question: 'Does the repetition add something? One clear "sorry" with what you did may carry more weight.',
  },
  {
    id: 'no_specifics_promise',
    strength: 'weak',
    pattern:
      /\bi(?:['’]ll|\s+will)\s+(?:try\s+(?:to\s+|not\s+to\s+)?(?:do\s+better|be\s+(?:better|more\s+\w+)|harder|change)|do\s+better|be\s+(?:better|more\s+(?:careful|considerate|mindful|thoughtful|aware))|change|make\s+it\s+up\s+to\s+you|fix\s+(?:it|this|things))\b|\b(?:it|this|that)\s+(?:won['’]t|will\s+not|shouldn['’]t)\s+happen\s+again\b|\bi\s+(?:promise|swear)\s+(?:to\s+)?(?:do\s+better|be\s+better|change)\b|\bthings\s+will\s+be\s+different\b|\bi['’]ll\s+make\s+sure\s+(?:it|this|that)\s+(?:doesn['’]t|won['’]t)\s+happen\b/gi,
    question: 'What will you do differently? A concrete step may land better.',
  },
  {
    id: 'absolute_promise',
    strength: 'weak',
    pattern:
      /\bnever\s+(?:do|say|let|hurt|make|ever|lie|yell|disappoint)\b[^.!?]{0,20}?\bagain\b|\bnever\s+happen\s+again\b|\bnever\s+again\b|\bnever\s+ever\b|\bi(?:['’]ll|\s+will)\s+(?:never|always)\s+(?:let\s+you\s+down|put\s+you\s+first|be\s+perfect)\b|\bi(?:['’]ll|\s+will)\s+do\s+(?:anything|whatever\s+(?:you\s+want|it\s+takes))\b|\bi\s+(?:promise|swear)\s+(?:i(?:['’]ll|\s+will)\s+)?never\b/gi,
    question: 'Can you keep a promise this big? A smaller, specific one may be easier to trust.',
  },
]
