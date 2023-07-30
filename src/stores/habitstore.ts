import type { Habit, Tracking } from "@prisma/client";
import { create } from "zustand";

interface HabitState extends Habit {
  Completed: Tracking[];
}
interface HabitStore {
  habits: HabitState[];
  addHabit: (habit: HabitState) => void;
  removeHabit: (id: string) => void;
  setHabits: (habits: HabitState[]) => void;
  updateTracking: (TrackingId: string) => void;
}
export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  removeHabit: (id) =>
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
  setHabits: (habits) => set(() => ({ habits })),
  updateTracking: (TrackingId) =>
    set((state) => ({
      habits: state.habits.map((habit) => {
        habit.Completed.map((track) => {
          if (track.id === TrackingId) {
            track.completed = !track.completed;
          }
          return track;
        });
        return habit;
      }),
    })),
}));
