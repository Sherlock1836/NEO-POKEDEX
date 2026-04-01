import { motion, AnimatePresence } from 'motion/react';
import { usePokemonStore } from '../store/usePokemonStore';
import { usePokemonDetail, usePokemonSpecies } from '../hooks/usePokemon';
import { X, Loader2, Weight, Ruler } from 'lucide-react';
import { cn } from '../lib/utils';

const typeColors: Record<string, string> = {
  fire: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  water: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  grass: 'bg-green-500/20 text-green-400 border-green-500/50',
  electric: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  psychic: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
  ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
  dragon: 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  dark: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  fairy: 'bg-pink-300/20 text-pink-300 border-pink-300/50',
  normal: 'bg-gray-300/20 text-gray-300 border-gray-300/50',
  fighting: 'bg-red-500/20 text-red-500 border-red-500/50',
  flying: 'bg-indigo-300/20 text-indigo-300 border-indigo-300/50',
  poison: 'bg-purple-400/20 text-purple-400 border-purple-400/50',
  ground: 'bg-amber-600/20 text-amber-600 border-amber-600/50',
  rock: 'bg-stone-500/20 text-stone-500 border-stone-500/50',
  bug: 'bg-lime-500/20 text-lime-500 border-lime-500/50',
  ghost: 'bg-violet-600/20 text-violet-600 border-violet-600/50',
  steel: 'bg-slate-400/20 text-slate-400 border-slate-400/50',
};

export function PokemonModal() {
  const { selectedPokemonId, setSelectedPokemonId, toggleCapture, isCaptured } = usePokemonStore();
  const { data: pokemon, isLoading: isPokemonLoading } = usePokemonDetail(selectedPokemonId);
  const { data: species, isLoading: isSpeciesLoading } = usePokemonSpecies(selectedPokemonId);

  const isOpen = !!selectedPokemonId;
  const captured = selectedPokemonId ? isCaptured(selectedPokemonId) : false;

  const description = species?.flavor_text_entries
    .find((entry) => entry.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPokemonId(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass-card overflow-hidden neon-border-blue max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPokemonId(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {(isPokemonLoading || isSpeciesLoading) ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
                <p className="font-mono text-xs tracking-widest animate-pulse">ACCESSING NEURAL DATA...</p>
              </div>
            ) : pokemon && (
              <div className="overflow-y-auto custom-scrollbar">
                {/* Header Section */}
                <div className="relative p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-b from-white/5 to-transparent">
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <div className="absolute inset-0 bg-neon-blue/10 rounded-full blur-3xl animate-pulse" />
                    <img
                      src={pokemon.sprites.other["official-artwork"].front_default}
                      alt={pokemon.name}
                      className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <span className="text-sm font-mono opacity-50 tracking-widest">#{String(pokemon.id).padStart(3, '0')}</span>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{pokemon.name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                      {pokemon.types.map((t) => (
                        <span
                          key={t.type.name}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                            typeColors[t.type.name] || "bg-white/5 text-white border-white/10"
                          )}
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleCapture(pokemon.id)}
                      className={cn(
                        "w-full md:w-auto px-8 py-3 rounded-xl font-bold uppercase tracking-widest transition-all",
                        captured 
                          ? "bg-neon-pink/20 text-neon-pink border border-neon-pink/50 shadow-[0_0_15px_rgba(255,0,255,0.2)]" 
                          : "bg-neon-blue/20 text-neon-blue border border-neon-blue/50 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
                      )}
                    >
                      {captured ? 'Release from Storage' : 'Capture Pokemon'}
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Description & Physical */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-3">Description</h3>
                      <p className="text-sm leading-relaxed opacity-80 italic">
                        {description || 'No data available in neural database.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-4 flex items-center gap-3">
                        <Ruler className="w-5 h-5 text-neon-blue" />
                        <div>
                          <p className="text-[10px] uppercase opacity-40">Height</p>
                          <p className="text-sm font-bold">{pokemon.height / 10}m</p>
                        </div>
                      </div>
                      <div className="glass-card p-4 flex items-center gap-3">
                        <Weight className="w-5 h-5 text-neon-blue" />
                        <div>
                          <p className="text-[10px] uppercase opacity-40">Weight</p>
                          <p className="text-sm font-bold">{pokemon.weight / 10}kg</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-3">Abilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {pokemon.abilities.map((a) => (
                          <span 
                            key={a.ability.name}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs capitalize font-medium"
                          >
                            {a.ability.name.replace('-', ' ')}
                            {a.is_hidden && <span className="ml-2 text-[8px] uppercase opacity-40">(Hidden)</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Base Stats */}
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-4">Base Stats</h3>
                    <div className="space-y-4">
                      {pokemon.stats.map((s) => (
                        <div key={s.stat.name}>
                          <div className="flex justify-between text-[10px] uppercase font-mono mb-1">
                            <span className="opacity-60">{s.stat.name.replace('-', ' ')}</span>
                            <span className="text-neon-blue">{s.base_stat}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-neon-blue to-neon-pink"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
