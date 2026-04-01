import { useQuery } from '@tanstack/react-query';
import { Pokemon, PokemonListResponse, PokemonSpecies } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const usePokemonList = () => {
  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: async (): Promise<Pokemon[]> => {
      const response = await fetch(`${BASE_URL}/pokemon?limit=151`);
      const data: PokemonListResponse = await response.json();
      
      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          return res.json();
        })
      );
      
      return detailedPokemon;
    },
  });
};

export const usePokemonDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: async (): Promise<Pokemon> => {
      if (!id) throw new Error('No ID provided');
      const response = await fetch(`${BASE_URL}/pokemon/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
};

export const usePokemonSpecies = (id: number | null) => {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: async (): Promise<PokemonSpecies> => {
      if (!id) throw new Error('No ID provided');
      const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
};
