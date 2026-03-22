import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MatchState {
  isSearching: boolean;
  matchStatus: 'idle' | 'searching' | 'matched';
  roomID: string | null;
  strangerID: string | null;
  setSearching: (isSearching: boolean) => void;
  setMatch: (roomID: string, strangerID: string) => void;
  resetMatch: () => void;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      isSearching: false,
      matchStatus: 'idle',
      roomID: null,
      strangerID: null,
      setSearching: (isSearching) =>
        set({
          isSearching,
          matchStatus: isSearching ? 'searching' : 'idle',
        }),
      setMatch: (roomID, strangerID) =>
        set({
          isSearching: false,
          matchStatus: 'matched',
          roomID,
          strangerID,
          // If we had a previous room, it might conflict, so we ensure it's set fresh
        }),
      resetMatch: () =>
        set({
          isSearching: false,
          matchStatus: 'idle',
          roomID: null,
          strangerID: null,
        }),
    }),
    {
      name: 'match-storage',
    }
  )
);
