import type { PersonaKey } from "./personality";

export interface QuizAnswer {
  label: string;
  /** Persona points awarded for choosing this answer. */
  weights: Partial<Record<PersonaKey, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "challenges",
    question: "How do you respond to challenges?",
    answers: [
      { label: "Pray immediately", weights: { faith_builder: 2, peace_seeker: 1 } },
      { label: "Seek advice", weights: { encouragement_seeker: 2, purpose_seeker: 1 } },
      { label: "Analyze the situation", weights: { wisdom_seeker: 2 } },
      { label: "Stay quiet", weights: { peace_seeker: 2 } },
    ],
  },
  {
    id: "encourages",
    question: "What encourages you most?",
    answers: [
      { label: "God's promises", weights: { faith_builder: 2 } },
      { label: "Worship", weights: { faith_builder: 1, peace_seeker: 1 } },
      { label: "Testimonies", weights: { encouragement_seeker: 2 } },
      { label: "Scripture", weights: { wisdom_seeker: 2 } },
    ],
  },
  {
    id: "calling",
    question: "What do you long for in your walk with God?",
    answers: [
      { label: "Deeper trust", weights: { faith_builder: 2 } },
      { label: "Rest & peace", weights: { peace_seeker: 2 } },
      { label: "Understanding", weights: { wisdom_seeker: 2 } },
      { label: "Clear purpose", weights: { purpose_seeker: 2 } },
    ],
  },
];

/**
 * Tally answers (indexes aligned to QUIZ) into a winning persona.
 * Ties break by QUIZ order of first contribution, then persona declaration.
 */
export function scoreQuiz(answerIndexes: number[]): PersonaKey {
  const scores: Record<string, number> = {};
  answerIndexes.forEach((answerIdx, qIdx) => {
    const answer = QUIZ[qIdx]?.answers[answerIdx];
    if (!answer) return;
    for (const [persona, pts] of Object.entries(answer.weights)) {
      scores[persona] = (scores[persona] ?? 0) + (pts ?? 0);
    }
  });

  let winner: PersonaKey = "faith_builder";
  let best = -1;
  for (const [persona, score] of Object.entries(scores)) {
    if (score > best) {
      best = score;
      winner = persona as PersonaKey;
    }
  }
  return winner;
}
