// Word groups used by the word-distance rules. Reference one as '@name'.
// Add a synonym here and every rule that uses the group picks it up.
export const LEX: Record<string, string[]> = {
  sorry: ['sorry', 'apolog*', 'regret*', 'pardon', 'remors*'],
  you: ['you', 'your', 'yours'],
  first: ['i', 'me', 'my', 'myself', 'we', 'our', 'us'], // the writer
  turn: ['but', 'however', 'although', 'though', 'except', 'nevertheless', 'nonetheless'],
  if: ['if', 'whether', 'case'],
  // things that could have happened to the other person
  harm: ['hurt*', 'upset*', 'offend*', 'insult*', 'bother*', 'annoy*', 'anger*', 'angry', 'disappoint*', 'wrong', 'harm*', 'disrespect*', 'uncomfortable', 'mad'],
  // how the other person is reacting (blaming it instead of owning your act)
  reaction: [
    'feel*', 'felt', 'think', 'thought', 'seem*', 'upset*', 'angry', 'mad', 'hurt*', 'offend*', 'bother*', 'annoy*', 'insult*',
    'sensitive', 'emotional', 'dramatic', 'touchy', 'defensive', 'irritat*', 'furious', 'disappoint*', 'uncomfortable', 'triggered',
    'misunderstood', 'misread', 'misinterpret*', 'misconstru*',
  ],
  mis: ['misunderstood', 'misread', 'misinterpret*', 'misconstru*', 'misheard'],
  causes: ['made', 'make', 'makes', 'forced', 'force', 'forcing', 'provoked', 'triggered', 'pushed', 'caused'],
}
