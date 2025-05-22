import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Interceptor para reintentos automáticos
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config.__retryCount) {
      config.__retryCount = 0;
    }

    if (
      (error.code === "ECONNABORTED" || error.response?.status >= 500) &&
      config.__retryCount < 3
    ) {
      config.__retryCount += 1;
      const delay = Math.pow(2, config.__retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(config);
    }

    return Promise.reject(error);
  }
);

// Obtener lista de Pokémon
export const getPokemonList = async (limit = 60, offset = 0) => {
  try {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);

    const pokemonList = await Promise.all(
      response.data.results.map(async (pokemon, index) => {
        try {
          const pokemonId = offset + index + 1;
          const details = await getPokemonDetails(pokemonId);
          return details;
        } catch (error) {
          console.error(`Error fetching pokemon ${pokemon.name}:`, error);
          return null;
        }
      })
    );

    // Filtrar los pokémon que no se pudieron cargar
    return pokemonList.filter((pokemon) => pokemon !== null);
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    throw new Error("Failed to fetch Pokemon list");
  }
};

// Obtener detalles de un Pokémon específico
export const getPokemonDetails = async (pokemonId) => {
  try {
    const response = await api.get(`/pokemon/${pokemonId}`);
    const pokemon = response.data;

    return {
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.other?.["official-artwork"]?.front_default ||
        pokemon.sprites.other?.dream_world?.front_default ||
        pokemon.sprites.front_default ||
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      types: pokemon.types.map((type) => type.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities.map((ability) => ability.ability.name),
      stats: pokemon.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      sprites: pokemon.sprites,
    };
  } catch (error) {
    console.error(`Error fetching Pokemon ${pokemonId}:`, error);
    throw new Error(`Failed to fetch Pokemon ${pokemonId}`);
  }
};

// Obtener información de especie para evoluciones
export const getPokemonSpecies = async (pokemonId) => {
  try {
    const response = await api.get(`/pokemon-species/${pokemonId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon species ${pokemonId}:`, error);
    throw new Error(`Failed to fetch Pokemon species ${pokemonId}`);
  }
};

// Obtener cadena de evolución
export const getEvolutionChain = async (evolutionUrl) => {
  try {
    const response = await axios.get(evolutionUrl);
    const chain = response.data.chain;

    const evolutions = [];

    // Función recursiva para extraer evoluciones
    const extractEvolutions = (evolutionData, min_level = null) => {
      evolutions.push({
        name: evolutionData.species.name,
        id: evolutionData.species.url.split("/").slice(-2, -1)[0],
        min_level,
      });

      if (evolutionData.evolves_to.length > 0) {
        evolutionData.evolves_to.forEach((evolution) => {
          const details = evolution.evolution_details[0];
          const nextMinLevel =
            details && details.min_level ? details.min_level : null;
          extractEvolutions(evolution, nextMinLevel);
        });
      }
    };

    extractEvolutions(chain);

    // Obtener detalles de cada evolución
    const evolutionDetails = await Promise.all(
      evolutions.map(async (evolution) => {
        try {
          const details = await getPokemonDetails(evolution.id);
          return {
            ...details,
            min_level: evolution.min_level,
          };
        } catch (error) {
          return null;
        }
      })
    );

    return evolutionDetails.filter(Boolean);
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
};

// Obtener todos los tipos de Pokémon
export const getPokemonTypes = async () => {
  try {
    const response = await api.get("/type");
    return response.data.results.map((type) => ({
      name: type.name,
      url: type.url,
    }));
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
    throw new Error("Failed to fetch Pokemon types");
  }
};

// Buscar Pokémon por nombre
export const searchPokemon = async (query) => {
  try {
    const response = await getPokemonDetails(query.toLowerCase());
    return [response];
  } catch (error) {
    return [];
  }
};
