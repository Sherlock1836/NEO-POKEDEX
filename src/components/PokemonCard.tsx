import React from 'react';
import { motion } from 'motion/react';
import { Pokemon } from '../types/pokemon';
import { usePokemonStore } from '../store/usePokemonStore';
import { cn } from '../lib/utils';
import { PokeballIcon } from './PokeballIcon';

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
  key?: number;
}

const typeColors: Record<string, string> = {
  fire: 'text-orange-400',
  water: 'text-blue-400',
  grass: 'text-green-400',
  electric: 'text-yellow-400',
  psychic: 'text-pink-400',
  ice: 'text-cyan-300',
  dragon: 'text-purple-500',
  dark: 'text-gray-500',
  fairy: 'text-pink-300',
  normal: 'text-gray-300',
  fighting: 'text-red-500',
  flying: 'text-indigo-300',
  poison: 'text-purple-400',
  ground: 'text-amber-600',
  rock: 'text-stone-500',
  bug: 'text-lime-500',
  ghost: 'text-violet-600',
  steel: 'text-slate-400',
};

export function PokemonCard({ pokemon, index }: PokemonCardProps) {
  const { toggleCapture, isCaptured, setSelectedPokemonId } = usePokemonStore();
  const captured = isCaptured(pokemon.id);

  const handleCapture = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCapture(pokemon.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "glass-card p-6 flex flex-col items-center relative group cursor-pointer overflow-hidden",
        captured ? "neon-border-pink" : "neon-border-blue"
      )}
      onClick={() => setSelectedPokemonId(pokemon.id)}
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-blue/5 rounded-full blur-3xl group-hover:bg-neon-blue/10 transition-colors" />
      
      <div className="relative z-10 w-full flex justify-between items-start mb-4">
        <span className="text-xs font-mono opacity-50">#{String(pokemon.id).padStart(3, '0')}</span>
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCapture}
          className="relative z-20 p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <motion.div
            animate={{ rotate: captured ? 360 : 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <PokeballIcon 
              className={cn(
                "w-6 h-6 transition-colors",
                captured ? "text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" : "text-white/20"
              )} 
            />
          </motion.div>
        </motion.button>
      </div>

      <div className="relative w-32 h-32 mb-4">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </div>

      <h3 className="text-xl font-bold capitalize mb-2 tracking-tight">{pokemon.name}</h3>

      <div className="flex gap-2">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className={cn(
              "text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10",
              typeColors[t.type.name] || "text-white"
            )}
          >
            {t.type.name}
          </span>
        ))}
      </div>

      {/* Stats Overlay on Hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-dark-bg/90 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center transition-opacity"
      >
        <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-neon-blue">Base Stats</h4>
        <div className="w-full space-y-2">
          {pokemon.stats.slice(0, 3).map((s) => (
            <div key={s.stat.name} className="flex justify-between text-xs font-mono">
              <span className="opacity-60 uppercase">{s.stat.name.replace('special-', 's-')}</span>
              <span className="text-white">{s.base_stat}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] opacity-40 italic uppercase tracking-widest">Access Neural Data</p>
      </motion.div>
    </motion.div>
  );
}
