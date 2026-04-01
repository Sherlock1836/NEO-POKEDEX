import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonModal } from './components/PokemonModal';
import { usePokemonStore } from './store/usePokemonStore';
import { motion } from 'motion/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const capturedCount = usePokemonStore((state) => state.capturedIds.length);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
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
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card px-6 py-4 flex items-center gap-4 border-neon-blue/20"
          >
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase opacity-50">Captured Data</p>
              <p className="text-2xl font-bold text-neon-blue">{capturedCount} / 151</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30">
              <div 
                className="w-8 h-8 rounded-full border-2 border-neon-blue border-t-transparent animate-spin" 
                style={{ animationDuration: '3s' }}
              />
            </div>
          </motion.div>
        </header>

        <main>
          <PokemonGrid />
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-mono uppercase opacity-30 tracking-widest">
            Powered by PokeAPI & Neural Link // 2026
          </p>
        </footer>

        <PokemonModal />
      </div>
    </QueryClientProvider>
  );
}
