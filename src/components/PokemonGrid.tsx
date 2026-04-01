import { usePokemonList } from '../hooks/usePokemon';
import { PokemonCard } from './PokemonCard';
import { Loader2 } from 'lucide-react';

export function PokemonGrid() {
  const { data: pokemon, isLoading, error } = usePokemonList();

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemon?.map((p, i) => (
        <PokemonCard key={p.id} pokemon={p} index={i} />
      ))}
    </div>
  );
}
