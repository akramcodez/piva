import type { Attendee } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AttendeeStore = {
  attendee: Attendee | null;
  setAttendee: (attendee: Attendee) => void;
  clearAttendee: () => void;
};

//create the Zustand store with persistence
export const useAttendeeStore = create<AttendeeStore>()(
  persist(
    (set) => ({
      attendee: null,
      setAttendee: (attendee) => set({ attendee }),
      clearAttendee: () => set({ attendee: null }),
    }),
    {
      name: 'attendee-storage',
    },
  ),
);
