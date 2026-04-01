import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '../lib/firebase';
import { onSnapshot, collection, doc, setDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface PokemonState {
  capturedIds: number[];
  selectedPokemonId: number | null;
  user: User | null;
  isAuthReady: boolean;
  toggleCapture: (id: number) => Promise<void>;
  isCaptured: (id: number) => boolean;
  setSelectedPokemonId: (id: number | null) => void;
  setUser: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  syncCaptured: (userId: string) => () => void;
}

export const usePokemonStore = create<PokemonState>()(
  persist(
    (set, get) => ({
      capturedIds: [],
      selectedPokemonId: null,
      user: null,
      isAuthReady: false,
      
      toggleCapture: async (id: number) => {
        const { user, capturedIds } = get();
        if (!user) return;

        const capturedPath = `users/${user.uid}/captured`;
        const pokemonDoc = doc(db, capturedPath, String(id));

        if (capturedIds.includes(id)) {
          await deleteDoc(pokemonDoc);
        } else {
          await setDoc(pokemonDoc, {
            pokemonId: id,
            capturedAt: serverTimestamp(),
            userId: user.uid,
          });
        }
      },

      isCaptured: (id: number) => get().capturedIds.includes(id),
      setSelectedPokemonId: (id: number | null) => set({ selectedPokemonId: id }),
      setUser: (user: User | null) => set({ user }),
      setAuthReady: (ready: boolean) => set({ isAuthReady: ready }),

      syncCaptured: (userId: string) => {
        const capturedPath = `users/${userId}/captured`;
        const unsubscribe = onSnapshot(collection(db, capturedPath), (snapshot) => {
          const ids = snapshot.docs.map((doc) => doc.data().pokemonId as number);
          set({ capturedIds: ids });
        }, (error) => {
          console.error('Firestore Error: ', JSON.stringify({
            error: error.message,
            operationType: 'list',
            path: capturedPath,
            authInfo: {
              userId: auth.currentUser?.uid,
              email: auth.currentUser?.email,
            }
          }));
        });
        return unsubscribe;
      },
    }),
    {
      name: 'captured-pokemon-storage',
      partialize: (state) => ({ capturedIds: state.capturedIds }),
    }
  )
);
