import { cn } from '../lib/utils';

const POKEMON_TYPES = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark',
  'fairy', 'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
  'ghost', 'steel'
];

const typeColors: Record<string, string> = {
  fire: 'hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/50',
  water: 'hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50',
  grass: 'hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50',
  electric: 'hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/50',
  psychic: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/50',
  ice: 'hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/50',
  dragon: 'hover:bg-purple-500/20 hover:text-purple-500 hover:border-purple-500/50',
  dark: 'hover:bg-gray-500/20 hover:text-gray-400 hover:border-gray-500/50',
  fairy: 'hover:bg-pink-300/20 hover:text-pink-300 hover:border-pink-300/50',
  normal: 'hover:bg-gray-300/20 hover:text-gray-300 hover:border-gray-300/50',
  fighting: 'hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50',
  flying: 'hover:bg-indigo-300/20 hover:text-indigo-300 hover:border-indigo-300/50',
  poison: 'hover:bg-purple-400/20 hover:text-purple-400 hover:border-purple-400/50',
  ground: 'hover:bg-amber-600/20 hover:text-amber-600 hover:border-amber-600/50',
  rock: 'hover:bg-stone-500/20 hover:text-stone-500 hover:border-stone-500/50',
  bug: 'hover:bg-lime-500/20 hover:text-lime-500 hover:border-lime-500/50',
  ghost: 'hover:bg-violet-600/20 hover:text-violet-600 hover:border-violet-600/50',
  steel: 'hover:bg-slate-400/20 hover:text-slate-400 hover:border-slate-400/50',
};

const activeTypeColors: Record<string, string> = {
  fire: 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
  water: 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]',
  grass: 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
  electric: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
  psychic: 'bg-pink-500/20 text-pink-400 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]',
  ice: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
  dragon: 'bg-purple-500/20 text-purple-500 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
  dark: 'bg-gray-500/20 text-gray-400 border-gray-500/50 shadow-[0_0_10px_rgba(107,114,128,0.3)]',
  fairy: 'bg-pink-300/20 text-pink-300 border-pink-300/50 shadow-[0_0_10px_rgba(249,168,212,0.3)]',
  normal: 'bg-gray-300/20 text-gray-300 border-gray-300/50 shadow-[0_0_10px_rgba(209,213,219,0.3)]',
  fighting: 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
  flying: 'bg-indigo-300/20 text-indigo-300 border-indigo-300/50 shadow-[0_0_10px_rgba(165,180,252,0.3)]',
  poison: 'bg-purple-400/20 text-purple-400 border-purple-400/50 shadow-[0_0_10px_rgba(192,132,252,0.3)]',
  ground: 'bg-amber-600/20 text-amber-600 border-amber-600/50 shadow-[0_0_10px_rgba(217,119,6,0.3)]',
  rock: 'bg-stone-500/20 text-stone-500 border-stone-500/50 shadow-[0_0_10px_rgba(120,113,108,0.3)]',
  bug: 'bg-lime-500/20 text-lime-500 border-lime-500/50 shadow-[0_0_10px_rgba(132,204,22,0.3)]',
  ghost: 'bg-violet-600/20 text-violet-600 border-violet-600/50 shadow-[0_0_10px_rgba(124,58,237,0.3)]',
  steel: 'bg-slate-400/20 text-slate-400 border-slate-400/50 shadow-[0_0_10px_rgba(148,163,184,0.3)]',
};

interface FilterBarProps {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

export function FilterBar({ selectedType, onSelectType }: FilterBarProps) {
  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-4 mb-8">
      <div className="flex gap-3 min-w-max px-2 justify-center">
        <button
          onClick={() => onSelectType(null)}
          className={cn(
            "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all",
            selectedType === null
              ? "bg-white/20 text-white border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          All Types
        </button>
        {POKEMON_TYPES.map((type) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onSelectType(isActive ? null : type)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all",
                isActive
                  ? activeTypeColors[type]
                  : `bg-white/5 text-white/50 border-white/10 ${typeColors[type]}`
              )}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
