import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PokemonState {
  capturedIds: number[];
  selectedPokemonId: number | null;
  toggleCapture: (id: number) => void;
  isCaptured: (id: number) => boolean;
  setSelectedPokemonId: (id: number | null) => void;
}

export const usePokemonStore = create<PokemonState>()(
  persist(
    (set, get) => ({
      capturedIds: [],
      selectedPokemonId: null,
      toggleCapture: (id: number) => {
        const { capturedIds } = get();
        if (capturedIds.includes(id)) {
          set({ capturedIds: capturedIds.filter((cid) => cid !== id) });
        } else {
          set({ capturedIds: [...capturedIds, id] });
        }
      },
      isCaptured: (id: number) => get().capturedIds.includes(id),
      setSelectedPokemonId: (id: number | null) => set({ selectedPokemonId: id }),
    }),
    {
      name: 'captured-pokemon-storage',
      partialize: (state) => ({ capturedIds: state.capturedIds }), // Only persist capturedIds
    }
  )
);
