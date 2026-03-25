import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MatchState {
  isSearching: boolean;
  matchStatus: 'idle' | 'searching' | 'matched';
  roomID: string | null;
  setSearching: (isSearching: boolean) => void;
  setMatch: (roomID: string) => void;
  resetMatch: () => void;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      isSearching: false,
      matchStatus: 'idle',
      roomID: null,
      setSearching: (isSearching) =>
        set({
          isSearching,
          matchStatus: isSearching ? 'searching' : 'idle',
        }),
      setMatch: (roomID) =>
        set({
          isSearching: false,
          matchStatus: 'matched',
          roomID,
        }),
      resetMatch: () =>
        set({
          isSearching: false,
          matchStatus: 'idle',
          roomID: null,
        }),
    }),
    {
      name: 'match-storage',
    }
  )
);
