import { useMemo } from 'react';
import { Pokemon } from '../types/pokemon';

export function usePokemonFilter(
  pokemonList: Pokemon[] | undefined,
  debouncedSearch: string,
  selectedType: string | null
) {
  return useMemo(() => {
    if (!pokemonList) return [];

    return pokemonList.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = selectedType
        ? pokemon.types.some((t) => t.type.name === selectedType)
        : true;

      return matchesSearch && matchesType;
    });
  }, [pokemonList, debouncedSearch, selectedType]);
}
