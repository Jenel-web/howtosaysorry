# Edge cases, false positives, and context differences for a rule-based apology checker

Note on evidence: searches returned abstracts, secondary summaries and practitioner pieces more often than full papers. Items marked "unverified" were not checked against the original paper. Many checker-design points are inferences and are labeled as such.

## 1. False positives: when a flagged phrase is actually fine

### Takeaway
The literature supports flagging conditional or blame-shifting forms ("sorry if you were offended", "sorry you feel that way"). I found no research that either way addresses a polite refusal ("sorry, but I can't make it"), sympathy-sorry, quotation, or negation. Those cases rest on linguistic reasoning, so rules should be soft and context-aware.

### Cited Findings
- Conditional apologies ("If I offended anyone, I am sorry") are described as the most common ineffective apology, read as implying the offended person is the problem — [Fortune/HBR-related coverage](https://fortune.com/2014/12/02/apologies-public-relations-crisis/); [Rice Business Wisdom](https://business.rice.edu/wisdom/features/what-makes-a-decent-apology) (the "Sorry you feel that way implies your reaction is not legitimate" quote)
- Lazare's work is cited as classifying "I'm sorry if mistakes were made" as a pseudo-apology, and "I'm sorry you feel hurt" as weaker than acknowledging the specific harm; this is commentary and book review, not a controlled experiment — [Berkeley GGIA](https://ggia.berkeley.edu/practice/making_an_effective_apology); [emotionalcompetency.com on Lazare](https://emotionalcompetency.com/apology.htm)
- Practitioner advice: a repair followed by "but" can reopen the conflict and provoke defensiveness. The source's authority is unclear, so treat it as practitioner opinion, not a Gottman finding — [aish.com](https://aish.com/how-to-repair-love/); Gottman Institute lists defensiveness (often counter-attacking) as one of the Four Horsemen — [Gottman Institute](https://www.gottman.com/blog/criticism-defensiveness-cycle)
- Gottman-related summary reports that the eloquence of a repair attempt did not predict its success, and that a repair counts only if the partner receives it. Secondary source; the high prediction-accuracy claims are noted as overstated/mixed in replications — [Gottman transcript summary](https://sozai.app/transcript/relationship-repair-that-works-dr-john-gottman/index.md); [glossary entry](https://higemma.pages.dev/blog/glossary/repair-attempt/)
- Most US apology statutes are written around "sympathy" statements, which supports distinguishing sympathy-sorry from fault-sorry (see section 3) — [ABA TortSource 2026](https://www.americanbar.org/groups/tort_trial_insurance_practice/resources/tortsource/2026-summer/power-apology-highstakes-conflict)

### Inferences (no source found; design reasoning)
- "but" false positives to suppress or soften: (a) "sorry, but I can't make it" / "sorry, but I have to cancel" (refusal, not apology; risk is low); (b) "I'm sorry. But I'd like to explain when you're ready" (sentence break plus an invitation); (c) "not X, but Y" constructions; (d) "I'm sorry, but also thank you". Heuristic: flag "but" most strongly when it follows an apology clause within the same sentence AND is followed by a self-justifying or other-blaming clause ("but you...", "but I was just..."). Lower priority when followed by "I'd like to explain if/when you want", "I understand if", or when the sentence has no remorse word.
- "if" is a legitimate question or consent request in "if you're open to it, can we talk?", "let me know if you want space", "if there's anything I can do". Flag mainly "sorry if", "apologize if", "if I hurt/offended you", "if you were upset". The pattern should be anchored to sorry/apologize + "if" within a few words, not a bare "if".
- "sorry for your loss", "sorry to hear that", "sorry you're going through this" are sympathy, not apology; they should not trigger "sorry you feel" style rules. Exempt "sorry to hear", "sorry for your loss", "sorry about your [noun]" when no first-person wrongdoing is present. Note that "sorry you feel that way" is different because it implies the other's reaction is the problem (sources above).
- Quoting or reporting someone else ("You said 'you always overreact', and that hurt me", "When you said I was selfish...") contains blame words but is not blaming. Exempt text inside quotation marks or after "you said/told me".
- Negations: "I'm not saying you're overreacting", "I don't think you're being dramatic" contain flagged words but disclaim them. Still, "I'm not saying X, but..." is a known pre-excuse pattern, so a gentle "does the 'but' undo what you said first?" is arguably still apt. This is judgment, not sourced.
- "always/never" self-referential or positive: "I never meant to hurt you", "I'll always be here", "I should never have said that" are about the speaker or are reassurances. Absolute words aimed at the other person ("you always", "you never") are the risky ones. Rule: flag only "you (always|never)" and "(always|never) (listen|care...)" aimed at the reader; exempt "I (always|never)" and "I'll always".
- Explanations: asked-for explanations ("you asked why, so here is what happened") are different from unprompted ones attached to the apology. A text cannot reveal whether the other person asked. Suggested gentle wording: "Did they ask for this explanation? If not, it may land as an excuse." Non-blocking.
- Accepted or reconciled situations: after the other person has accepted the apology, explanation is less risky. No source; the tool cannot see this, so keep flags dismissable.

### Gaps
- No empirical research found on false-positive rates of keyword apology checkers, or on "sorry, but" as a polite refusal.
- No primary Gottman source on "yes, but" found; only secondary summaries.
- No controlled study found on quoting/negation effects; the above is linguistic reasoning.

## 2. Context differences: relationship, medium, culture, gender

### Takeaway
Effective-apology content seems to matter more than channel in the one controlled experiment found, but culture and gender change what counts as an offense and what an apology means. The tool should avoid universal "should" language and let users dismiss flags.

### Cited Findings
- Gender: Schumann and Ross (2010, Psychological Science 21(11), 1649-1655) found that women reported apologizing more often than men, but apologized for the same proportion of offenses they perceived; men rated offenses as less severe, which predicted deserving/giving an apology. The authors attribute the gap to differing thresholds for what is offensive, not to men's unwillingness. Samples were undergraduates — [APS Observer](https://www.psychologicalscience.org/publications/observer/obsonline/when-do-you-owe-an-apology-depends-on-gender.html); [Waterloo dissertation record](https://uwspace.uwaterloo.ca/items/0d8bfbb4-a3a7-40c4-8558-3bfc18219151/full); [MindBlog summary](https://mindblog.dericbownds.net/2010/12/why-women-apologize-more-than-men.html)
- Culture: Maddux, Kim, Okumura and Brett (2011, International Negotiation 16(3), 405-425) hypothesize that in individual-agency cultures (US) apologies are read as assigning blame and restoring order, while in collective-agency cultures (Japan) they express general remorse without necessarily assigning culpability. Only abstracts and summaries were read here — [Harvard PON summary](https://www.pon.harvard.edu/daily/international-negotiation-daily/international-negotiation-skills-before-apologizing-consider-the-culture); [INSEAD record](https://www.insead.edu/faculty-research/publications/journal-articles/cultural-differences-function-and-meaning-apologies); [UNC PDF](https://willmaddux.web.unc.edu/wp-content/uploads/sites/15846/2018/04/IN-Culture-and-Apologies.pdf)
- Japanese "sumimasen" is used as apology, thanks and attention-getter, so an apology word does not always signal fault (Risako Ide 1998; Kimura corpus study). Note: this is Risako Ide, not Sachiko Ide — [CARLA bibliography](https://archive.carla.umn.edu/speechacts/japanese/apologies/apologiesbiblio.htm); [Kimura, eScholarship](https://escholarship.org/content/qt73q6b248/qt73q6b248.pdf?t=le40p0); [Journal of Pragmatics abstract](https://katalog.lib.cas.cz/KNAV/EdsRecord/edsair,edsair.doi...........36b8f1049c033a535d165dabc13472ae)
- Medium: a University of Tampa 2x2 experiment (effective elements present/absent x face-to-face/text) found text with effective elements produced forgiveness similar to face-to-face; quality mattered more than medium — [Communicating Apologies Effectively](https://utampa.dspacedirect.org/handle/20.500.11868/3402)
- Medium, correlational: a secondary article cites a couples study where couples using text for serious discussions had lower relationship satisfaction than those talking face-to-face; original not checked — [Mailbird summary](https://www.getmailbird.com/apologizing-email-repair-trust/) and the search overview above (unverified)
- Corporate/public: conditional "if anyone was offended" statements are widely criticized in corporate apologies (e.g. the H&M example reported by commentators); unqualified apology plus concrete remedy is recommended — [Rice Business Wisdom](https://business.rice.edu/wisdom/features/what-makes-a-decent-apology); [Fortune](https://fortune.com/2014/12/02/apologies-public-relations-crisis/); [Columbia Business School](https://business.columbia.edu/faculty/research/organizational-apology)

### Inferences
- Because Schumann and Ross show the gap is about perceived severity, avoid any gender-linked wording or default; one gentle question could be "Does the other person see this as serious? It may matter more to them than to you."
- Because apology meaning differs by culture, the tool should state it is tuned to English-language, mostly US-style norms and keep flags as questions. Phrases like "sorry for the trouble" or "sorry to bother you" can be ordinary politeness (and in some languages gratitude-adjacent) and should have low strength.
- Workplace vs romantic vs customer service: expected differences (a manager may prefer brevity and a fix; a partner may need acknowledgment of feelings; corporate text should avoid blanket "sorry for any inconvenience") are plausible but I found no peer-reviewed comparison. A context toggle is out of scope per CLAUDE.md; keep one rule set.
- Short text/SMS: very long apologies and long explanations may be harder to read in chat; supported only by practitioner opinion, so keep the length hint non-judgmental.

### Gaps
- Could not read Maddux et al., Sugimoto, or Sachiko Ide's own papers; only abstracts, summaries and a bibliography. Sachiko Ide's arguments (politeness as discernment/wakimae) are not documented here.
- No Pew data found on apologies or texting conflict.
- No peer-reviewed comparison of workplace vs romantic vs social-media apologies found.

## 3. Risky-but-plausible apologies

### Takeaway
Evidence is strongest for legal protection varying widely by state and for timing/sincerity; it is weakest (clinical observation only) for over-apologizing in abusive dynamics. These scenarios are mostly undetectable from text, so warnings should be general, optional prompts.

### Cited Findings
- Legal: roughly 36-39 states plus DC have apology statutes by different counts. Many protect only sympathy, not admissions of fault; a smaller group (Colorado is the usual example) protects fault admissions too; Ohio courts read their statute narrowly at one point. Statutes are mostly medical-malpractice focused. Counts vary by source and year; this is not legal advice — [ABA TortSource 2026](https://www.americanbar.org/groups/tort_trial_insurance_practice/resources/tortsource/2026-summer/power-apology-highstakes-conflict); [AMA Journal of Ethics](https://journalofethics.ama-assn.org/article/im-sorry-laws-and-medical-liability/2007-04); [Relias on ineffectiveness](https://reliasmedia.com/articles/148885-evidence-shows-apology-laws-are-largely-ineffective); [AHRQ PSNet](https://psnet.ahrq.gov/issue/sorry-never-enough-how-state-apology-laws-fail-reduce-medical-malpractice-liability-risk)
- Maddux et al. summary notes that in the US an apology must be weighed against legal and reputational risks — [Harvard PON](https://www.pon.harvard.edu/daily/international-negotiation-daily/international-negotiation-skills-before-apologizing-consider-the-culture)
- Over-apologizing when not at fault: a psychologist describes constant apologizing as a possible trauma after-effect, a protective habit to avoid triggering harm; clinicians advise against simply telling survivors to stop; power imbalance is described as a risk factor, with lower-power partners often over-apologizing. This is clinical commentary, not controlled research — [DomesticShelters.org](https://www.domesticshelters.org/domestic-violence-articles-information/you-can-stop-apologizing-now); [Psychology Today](https://www.psychologytoday.com/sg/blog/in-love-and-war/202305/does-your-partner-have-too-much-power-over-you)
- Self-silencing: one study (as reported secondhand) found higher self-silencing linked to conceding more in conflict and poorer communication; the research did not examine adult over-apologizing specifically — [ScienceBlog](https://scienceblog.com/t-people-apologise-not-their-fault-blame-keeping-calm-conflict/)
- Too much sorry: Psychology Today column on "when I'm sorry is too much" (content not read in detail) — [Psychology Today](https://www.psychologytoday.com/us/blog/in-love-and-war/201306/when-im-sorry-is-too-much)
- Instrumental apologies: an apology used to avoid punishment or rejection is described as instrumental, and a PLOS ONE paper defines a "bad-faith apology"; apologies cost-bearing for the offender are more effective (secondary summary) — [Science of People](https://scienceofpeople.com/apology); [PMC6224065](https://rcastoragev2.blob.core.windows.net/5f7203f7147f830ff9952d3b94b46860/PMC6224065.pdf)
- Timing: a Melbourne study found a delayed verbal collective apology was perceived as less sincere; a paper titled "Do not apologise too early" exists (economics; abstract only) and an unspecified 2001 study is cited for premature apologies failing. The evidence is mixed and the sources are secondary — [Melbourne (minerva-access)](https://minerva-access.unimelb.edu.au/server/api/core/bitstreams/b9233b05-7e58-5f21-8d38-f8aa601b28d0/content); [Do not apologise too early](https://ideas.repec.org/a/eee/soceco/v90y2021ics2214804320306893.html); [PopSci](https://www.popsci.com/?p=437313)
- Rejected repair can escalate: a repair only counts if received, and a rebuffed one can escalate more than none (glossary, unverified) — [higemma glossary](https://higemma.pages.dev/blog/glossary/repair-attempt/)

### Inferences and suggested gentle prompts (none of these block copying)
Triggers are only text-detectable cues; the rest need an always-available general note.
- Over-apologizing / possibly not at fault (trigger: 3+ "sorry"s, "it's all my fault", "I'm such a mess", "I'll never do it again", "please don't be mad"): "Is all of this yours to own? It may be fine to apologize only for the part that was." Avoid any language that could read as diagnosing abuse; consider a quiet optional resource line, not a flag.
- Makes the other person comfort you (trigger: "I'm a terrible person", "I hate myself", "I don't deserve you", "please forgive me", "I can't live with this"): "Does this ask them to reassure you? It may leave less room for how they feel." (Mechanism is inferred; no source found.)
- Apologizing to get something (trigger: "if you forgive me, we can...", "now can you...", "I'll do X if you Y", "so can we go back to normal"): "Is this apology tied to something you want back? It may read as a trade." Supported loosely by the instrumental-apology definition above.
- Too soon / during active conflict / by text: "Has the other person had time to cool off? Would a short message offering to talk later fit better?" Weak evidence; the Tampa study suggests text can work if the apology's elements are present, so keep the question about readiness, not about the medium.
- Asked for space/no contact (trigger on user-typed text like "I know you said you need space", "I know you don't want to hear from me"): "They asked for space. Is sending this now what they asked for?" No source found for apology-specific effects; reasoning is respect for a stated boundary. Because detection is weak, also offered as a general question in the pause overlay.
- Public vs private (trigger: "@", "everyone", "publicly", hashtags, "to all of you"): "Was the harm public or private? A public apology for a private matter may expose the other person." Inferred; no source found.
- Group/collective apologies ("we are sorry", "the team apologizes", "our company regrets"): "Who is 'we'? Did everyone agree, and does the person hurt hear from someone who owns it?" Supported only by the corporate-apology commentary above and general practice; no study on group apologies read.
- Legal exposure (trigger: "my fault", "I was negligent", "I admit", "liable", "accident", "injury", "contract", "insurance", "damages", "lawsuit"): "Could there be legal or insurance consequences? Some places treat an apology differently; a lawyer or HR can say whether this wording is okay." Must not give legal advice, state-specific claims, or say apologizing is unlawful; the sources show protection varies and mostly concerns healthcare.
- Apologizing for something you did not do ("I'm sorry I made you angry", "sorry for existing", "sorry for being too sensitive"): the pattern "sorry for being X" about the user's own feelings or needs may signal self-blame. Same gentle question as over-apologizing.

### Gaps
- No reliable controlled research found on apologizing during active conflict by text, apologizing after a no-contact request, group apology norms between individuals, or apologies that elicit comfort.
- Legal summaries focus on medical liability; I did not locate a source on civil or workplace non-medical apology statutes by state, and counts of states differ across sources.
- The over-apologizing/abuse link rests on clinical observation and blogs; no empirical study found.
- Primary Lazare (2004, *On Apology*) and Lewicki, Polin and Lount (2016) texts not read.

## 4. Gentle-warning design notes for the checker

### Takeaway
Keep each warning a dismissable question that names a possible effect ("may", "does this...?"). Lower strength for ambiguous patterns, and require sentence-level conditions to cut false positives.

### Cited Findings
- Defensiveness and non-receipt of repair are the practical risks that justify questions about "but", "if", and blame framing — [Gottman Institute](https://www.gottman.com/blog/criticism-defensiveness-cycle); [Fortune](https://fortune.com/2014/12/02/apologies-public-relations-crisis/)
- Schumann and Ross's finding that people legitimately disagree about whether an offense occurred ("Neither men nor women are wrong") supports non-verdict phrasing — [APS Observer](https://www.psychologicalscience.org/publications/observer/obsonline/when-do-you-owe-an-apology-depends-on-gender.html)

### Inferences
- Example question templates (non-blocking, matching the project rule "question, not verdict"):
  - "but": "Does the part after 'but' take back what you said first?" (weak when preceded by a period or followed by an invitation to talk).
  - "sorry if / sorry you feel": "This may sound like the problem is their reaction. Do you want to name what you did instead?"
  - "you always / you never": "Does this describe one moment, or may it sound like a pattern they'll want to argue with?"
  - Excuses/explanations: "Did they ask for the reason? It may land better after they've heard the apology."
  - Many sorrys: "Does the message say 'sorry' more than once? One clear one may carry more weight." (inferred)
  - Reassurance-seeking, instrumental, space request, legal, public: the questions listed in section 3.
- Strength guidance: strong flags for "sorry if", "sorry you feel", "you always/never"; weak flags for "but" (unless apology + but in one clause), explanation phrases, many sorrys, and all context-risk cues. When strong and weak overlap, keep the strong one (per CLAUDE.md).
- Suppression list for rules: sympathy phrases ("sorry for your loss", "sorry to hear"), text in quotes, "I never/I always", "if you're open to", "let me know if", sentence-initial "But" after a full stop, "sorry, but I can't/have to" (refusal).
- Add a plain footer note that the tool is a rule-based reader of wording, can't see context (who asked for what, relationship, culture), and is not legal advice. Do not ship any claim that the rules are validated; none of the sources test this tool's rules.

### Gaps
- No evidence on the effect of question-form warnings on apology quality or user behavior was found.
