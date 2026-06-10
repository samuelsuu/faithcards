import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PreferencesState {
  darkMode: boolean;
  notificationsEnabled: boolean;
  reminderTime: string; // "HH:mm"
  /** Last mood/needs picked on Home, for convenience. */
  lastMood: string | null;
  lastNeeds: string[];

  setDarkMode: (v: boolean) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setReminderTime: (t: string) => void;
  setLastSelection: (mood: string | null, needs: string[]) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      darkMode: false,
      notificationsEnabled: true,
      reminderTime: "07:30",
      lastMood: null,
      lastNeeds: [],

      setDarkMode: (darkMode) => set({ darkMode }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      setReminderTime: (reminderTime) => set({ reminderTime }),
      setLastSelection: (lastMood, lastNeeds) => set({ lastMood, lastNeeds }),
    }),
    {
      name: "faithcards-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
