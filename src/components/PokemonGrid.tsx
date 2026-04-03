import { useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import { PokemonCard } from './PokemonCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemonFilter } from '../hooks/usePokemonFilter';
import { motion, AnimatePresence } from 'motion/react';

export function PokemonGrid() {
  const { data: pokemon, isLoading, error } = usePokemonList();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const filteredPokemon = usePokemonFilter(pokemon, debouncedSearch, selectedType);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
        <p className="font-mono text-sm tracking-widest animate-pulse">INITIALIZING POKEDEX DATA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 glass-card neon-border-pink">
        <p className="text-neon-pink font-bold">SYSTEM ERROR: FAILED TO RETRIEVE DATA</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-neon-pink/20 border border-neon-pink/50 rounded-lg hover:bg-neon-pink/40 transition-colors"
        >
          REBOOT SYSTEM
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="sticky top-0 z-30 pt-4 pb-2 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:static">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <FilterBar selectedType={selectedType} onSelectType={setSelectedType} />
      </div>

      {filteredPokemon.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 glass-card border-white/10"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-pink/10 animate-pulse" />
            <AlertCircle className="w-12 h-12 text-white/40" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-widest text-white/50 mb-2">No Signals Detected</h3>
          <p className="text-sm font-mono text-white/30 tracking-widest text-center max-w-md">
            Adjust your scanner frequencies. No biological matches found for current parameters.
          </p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPokemon.map((p, i) => (
              <PokemonCard key={p.id} pokemon={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
