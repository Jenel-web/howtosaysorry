import type { Rule } from './types'

export const rules: Rule[] = [
  {
    id: 'sorry_but',
    strength: 'strong',
    pattern: /\b(?:sorry|apologi[sz]e)\b(?:\W+\w+){0,5}?\W+but\b/gi,
    question: 'Does this "but" explain, or excuse?',
  },
  {
    id: 'sorry_you_feel',
    strength: 'strong',
    pattern: /\bsorry\s+(?:that\s+)?you\s+(?:feel|felt|are|were)\b/gi,
    question: 'This can sound like the problem is their reaction. Can you name what you did?',
  },
  {
    id: 'if_i_hurt',
    strength: 'strong',
    pattern: /\bif\s+i\s+(?:hurt|upset|offended)\b/gi,
    question: '"If" can sound like you doubt it happened. Can you say that it did?',
  },
  {
    id: 'always_never',
    strength: 'strong',
    pattern: /\byou\s+(?:always|never)\b/gi,
    question: '"Always" and "never" can start a new argument. Is this about this one time?',
  },
  {
    id: 'blame_shift',
    strength: 'strong',
    pattern: /\byou\s+made\s+me\b|\bbecause\s+you\b/gi,
    question: 'This may shift the blame to them. Is that what you mean?',
  },
  {
    id: 'minimizing',
    strength: 'strong',
    pattern: /\boverreact(?:ing)?\b|\btoo\s+sensitive\b|\bcalm\s+down\b|\bjust\s+a\s+joke\b|\bnot\s+a\s+big\s+deal\b/gi,
    question: 'This may make their feelings seem small.',
  },
  {
    id: 'pressure',
    strength: 'weak',
    pattern: /\bforgive\s+me\s+already\b|\bso\s+we'?re\s+good\b|\byou\s+have\s+to\s+forgive\b/gi,
    question: 'Asking for forgiveness right away can feel like pressure.',
  },
  {
    id: 'loose_but',
    strength: 'weak',
    pattern: /\bbut\b/gi,
    question: 'Worth a second look?',
  },
]
