import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getPokemonList,
  getPokemonDetails,
  getPokemonSpecies,
  getEvolutionChain,
  getPokemonTypes,
} from "../services/pokemonApi";

const FAVORITES_KEY = "@pokemon_favorites";

export const usePokemonStore = create((set, get) => ({
  pokemonList: [],
  filteredPokemonList: [],
  favorites: [],
  pokemonTypes: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedTypes: [],
  offset: 0,
  hasMore: true,
  allPokemonNames: [],
  allPokemonNamesLoading: false,
  allPokemonNamesError: null,

  // Acciones para la lista de Pokémon
  fetchPokemonList: async (reset = false) => {
    set({ loading: true, error: null });
    try {
      const { offset, pokemonList } = get();
      const limit = 60;
      const currentOffset = reset ? 0 : offset;
      const newPokemons = await getPokemonList(limit, currentOffset);

      const updatedList = reset
        ? newPokemons
        : [...pokemonList, ...newPokemons];

      set({
        pokemonList: updatedList,
        filteredPokemonList: updatedList,
        loading: false,
        offset: currentOffset + limit,
        hasMore: newPokemons.length === limit,
      });
    } catch (error) {
      set({
        error: error.message || "Error desconocido al cargar los Pokémon",
        loading: false,
      });
    }
  },

  // Obtener todos los nombres de Pokémon
  fetchAllPokemonNames: async () => {
    set({ allPokemonNamesLoading: true, allPokemonNamesError: null });
    try {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=2000"
      );
      set({
        allPokemonNames: response.data.results,
        allPokemonNamesLoading: false,
      });
    } catch (error) {
      set({
        allPokemonNamesError: error.message,
        allPokemonNamesLoading: false,
      });
      console.error("Error fetching all Pokémon names:", error);
    }
  },

  fetchMorePokemon: async () => {
    const { loading, hasMore, searchQuery, selectedTypes } = get();
    if (loading || !hasMore || searchQuery.trim() || selectedTypes.length > 0)
      return;
    await get().fetchPokemonList();
  },

  // Buscar Pokémon
  searchPokemon: async (query) => {
    set({ searchQuery: query });
    if (!query.trim()) {
      get().applyFilters();
      return;
    }
    set({ loading: true });

    try {
      const { allPokemonNames } = get();
      const matches = allPokemonNames
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.url.split("/").slice(-2, -1)[0].includes(query)
        )
        .slice(0, 20);

      const results = await Promise.all(
        matches.map((p) => getPokemonDetails(p.name))
      );

      set({
        filteredPokemonList: results.filter(Boolean),
        loading: false,
      });
    } catch {
      set({
        filteredPokemonList: [],
        loading: false,
      });
    }
  },

  // Filtrar por tipos
  toggleTypeFilter: (typeName) => {
    const { selectedTypes } = get();
    const newSelectedTypes = selectedTypes.includes(typeName)
      ? selectedTypes.filter((type) => type !== typeName)
      : [...selectedTypes, typeName];

    set({ selectedTypes: newSelectedTypes });
    get().applyFilters();
  },

  // Aplicar todos los filtros
  applyFilters: () => {
    const { pokemonList, searchQuery, selectedTypes } = get();

    let filtered = pokemonList;

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por tipos
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((type) => selectedTypes.includes(type))
      );
    }

    set({ filteredPokemonList: filtered });
  },

  // Limpiar filtros
  clearFilters: () => {
    const { pokemonList } = get();
    set({
      searchQuery: "",
      selectedTypes: [],
      filteredPokemonList: pokemonList,
    });
  },

  // Obtener tipos de Pokémon
  fetchPokemonTypes: async () => {
    try {
      const types = await getPokemonTypes();
      set({ pokemonTypes: types });
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  },

  // Gestión de favoritos
  loadFavorites: async () => {
    try {
      const favoritesString = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites = favoritesString ? JSON.parse(favoritesString) : [];
      set({ favorites });
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  },

  saveFavorites: async (favorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  },

  toggleFavorite: async (pokemon) => {
    const { favorites } = get();
    const isFavorite = favorites.some((fav) => fav.id === pokemon.id);

    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== pokemon.id);
    } else {
      newFavorites = [...favorites, pokemon];
    }

    set({ favorites: newFavorites });
    await get().saveFavorites(newFavorites);
  },

  isFavorite: (pokemonId) => {
    const { favorites } = get();
    return favorites.some((fav) => fav.id === pokemonId);
  },

  // Obtener detalles
  fetchPokemonWithEvolutions: async (pokemonId) => {
    set({ loading: true, error: null });
    try {
      const pokemon = await getPokemonDetails(pokemonId);
      const species = await getPokemonSpecies(pokemonId);
      const evolutions = await getEvolutionChain(species.evolution_chain.url);

      set({ loading: false });
      return {
        ...pokemon,
        evolutions,
      };
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
