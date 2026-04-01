import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonModal } from './components/PokemonModal';
import { usePokemonStore } from './store/usePokemonStore';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, db } from './lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const { user, setUser, isAuthReady, setAuthReady, syncCaptured, capturedIds } = usePokemonStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create/Update user profile in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            createdAt: serverTimestamp(),
          });
        }
        
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, setAuthReady]);

  useEffect(() => {
    if (user) {
      const unsubscribe = syncCaptured(user.uid);
      return () => unsubscribe();
    }
  }, [user, syncCaptured]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs tracking-widest text-neon-blue animate-pulse">SYNCHRONIZING NEURAL LINK...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink"
            >
              Neo-Pokedex
            </motion.h1>
            <p className="mt-2 text-sm font-mono tracking-[0.3em] uppercase opacity-40">
              Neural Interface v2.0 // Kanto Region
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <AnimatePresence mode="wait">
              {user ? (
                <motion.div 
                  key="user-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4"
                >
                  <div className="glass-card px-6 py-4 flex items-center gap-4 border-neon-blue/20">
                    <div className="text-right">
                      <p className="text-[10px] font-mono uppercase opacity-50">Captured Data</p>
                      <p className="text-2xl font-bold text-neon-blue">{capturedIds.length} / 151</p>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-neon-blue/30">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-neon-blue/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-neon-blue" />
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-pink/10 hover:border-neon-pink/30 hover:text-neon-pink transition-all group"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="login-btn"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={handleLogin}
                  className="glass-card px-8 py-4 flex items-center gap-3 border-neon-blue/50 hover:bg-neon-blue/10 transition-all group"
                >
                  <LogIn className="w-5 h-5 text-neon-blue group-hover:scale-110 transition-transform" />
                  <span className="font-bold uppercase tracking-widest text-sm">Initialize Link</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main>
          {user ? (
            <PokemonGrid />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 glass-card neon-border-blue">
              <div className="w-20 h-20 rounded-full bg-neon-blue/10 flex items-center justify-center mb-6 border border-neon-blue/30">
                <LogIn className="w-10 h-10 text-neon-blue" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight mb-2">Neural Link Required</h2>
              <p className="text-sm opacity-50 font-mono tracking-widest mb-8">AUTHENTICATE TO ACCESS POKEDEX DATABASE</p>
              <button 
                onClick={handleLogin}
                className="px-12 py-4 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-xl font-bold uppercase tracking-widest hover:bg-neon-blue/30 transition-all shadow-[0_0_20px_rgba(0,243,255,0.2)]"
              >
                Connect with Google
              </button>
            </div>
          )}
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-mono uppercase opacity-30 tracking-widest">
            Powered by PokeAPI & Firebase // 2026
          </p>
        </footer>

        <PokemonModal />
      </div>
    </QueryClientProvider>
  );
}
