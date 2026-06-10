import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PersonaKey } from "@/constants/personality";

interface OnboardingState {
  /** Has the user seen the intro carousel? */
  introSeen: boolean;
  name: string;
  gender: string | null;
  /** Selected answer index per quiz question id. */
  answers: Record<string, number>;
  persona: PersonaKey | null;

  setIntroSeen: (v: boolean) => void;
  setName: (name: string) => void;
  setGender: (gender: string | null) => void;
  setAnswer: (questionId: string, answerIndex: number) => void;
  setPersona: (persona: PersonaKey | null) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      introSeen: false,
      name: "",
      gender: null,
      answers: {},
      persona: null,

      setIntroSeen: (v) => set({ introSeen: v }),
      setName: (name) => set({ name }),
      setGender: (gender) => set({ gender }),
      setAnswer: (questionId, answerIndex) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: answerIndex } })),
      setPersona: (persona) => set({ persona }),
      reset: () =>
        set({ name: "", gender: null, answers: {}, persona: null }),
    }),
    {
      name: "faithcards-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
