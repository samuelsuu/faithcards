import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { todayKey } from "@/lib/utils";

const MAX_CARDS = 5;

interface DailyState {
  date: string;
  generated: boolean;
  viewedScriptureIds: string[];
  /** Roll over to a fresh day if the stored date is stale. */
  ensureToday: () => void;
  markGenerated: () => void;
  markViewed: (scriptureId: string) => void;
  remaining: () => number;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      date: todayKey(),
      generated: false,
      viewedScriptureIds: [],

      ensureToday: () => {
        const today = todayKey();
        if (get().date !== today) {
          set({ date: today, generated: false, viewedScriptureIds: [] });
        }
      },

      markGenerated: () => set({ generated: true }),

      markViewed: (scriptureId) =>
        set((s) =>
          s.viewedScriptureIds.includes(scriptureId)
            ? s
            : { viewedScriptureIds: [...s.viewedScriptureIds, scriptureId] },
        ),

      remaining: () => Math.max(0, MAX_CARDS - get().viewedScriptureIds.length),
    }),
    {
      name: "faithcards-daily",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const DAILY_MAX_CARDS = MAX_CARDS;
