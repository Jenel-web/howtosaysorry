export const feelings = ['Guilty', 'Hurt', 'Angry', 'Shame', 'Humility', 'Hope'] as const
export type Feeling = (typeof feelings)[number]

export const templates: Record<Feeling, string[]> = {
  Guilty: [
    "I'm sorry for ___. I know it made you feel ___. Next time I'll ___.",
    "I keep thinking about ___ and how it affected you. I was wrong to ___. I'm sorry.",
    "I'm sorry I ___. You deserved better from me, and I take responsibility for it.",
    "I can't stop thinking about what I did when I ___. I'm sorry I put you through ___.",
    "I did ___, and I know that hurt you. I'm sorry, and I want to make it right by ___.",
  ],
  Hurt: [
    "I've been feeling ___ since ___, and I reacted by ___. I'm sorry for that part. I'd like to ___.",
    "I was hurt when ___, and I handled it badly by ___. I'm sorry for how I acted. Can we talk about ___?",
    "I was feeling ___ and I took it out on you by ___. That wasn't fair to you. I'm sorry.",
    "What happened with ___ really stung, and I said ___ because of it. I'm sorry I said that.",
    "I've been carrying ___ and it came out as ___. I'm sorry. I'd like to tell you what was going on for me.",
  ],
  Angry: [
    "I was angry about ___, and I said ___. I'm sorry. Nothing excuses how I spoke to you.",
    "I lost my temper when ___. I'm sorry I ___. I'm working on ___ so it doesn't happen again.",
    "I'm sorry for raising my voice about ___. I should have ___ instead.",
    "I let my anger decide how I acted when ___. I'm sorry for ___. Next time I'll step away and ___.",
    "I said things in anger, including ___. I didn't mean to hurt you, and I'm sorry that I did.",
  ],
  Shame: [
    "I'm ashamed of how I ___. I'm sorry. I know I let you down.",
    "I've been avoiding you because I'm embarrassed about ___. I'm sorry for going quiet. I'd like to ___.",
    "I feel awful about ___. It isn't who I want to be, and I'm sorry I ___.",
    "This is hard for me to say. I'm sorry for ___. I'm ashamed that ___.",
    "I hid from this for too long. I'm sorry for ___, and I'm ready to face it by ___.",
  ],
  Humility: [
    "I was wrong about ___. I'm sorry. I see now that ___.",
    "I didn't listen when you ___. I'm sorry. I want to understand how it was for you.",
    "I made it about me when ___. I'm sorry. Will you tell me what I missed?",
    "I'm sorry for ___. I don't have an excuse. I'd like to learn how to ___.",
    "I had it wrong when I ___. Thank you for ___. I'm sorry, and I'll do better at ___.",
  ],
  Hope: [
    "I'm sorry for ___. I care about us, and I'd like to ___ whenever you're ready.",
    "I'm sorry I ___. I hope we can find our way back to ___. No pressure, and I'm here when you want to talk.",
    "I regret ___. What we have matters to me, and I'm committed to ___.",
    "I'm sorry for ___. I'd like to make things better by ___. I hope that's okay with you.",
    "I know I hurt you when I ___. I'm sorry. I hope that over time we can ___, and I'll give you the space you need.",
  ],
}
