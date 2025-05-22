// Colores para los tipos de Pokémon
export const TYPE_COLORS = {
  normal: '#A8A8A8',
  fire: '#FF4422',
  water: '#3399FF',
  electric: '#FFCC33',
  grass: '#77CC55',
  ice: '#66CCFF',
  fighting: '#BB5544',
  poison: '#AA5599',
  ground: '#DDBB55',
  flying: '#8899FF',
  psychic: '#FF5599',
  bug: '#AABB22',
  rock: '#BBAA66',
  ghost: '#6666BB',
  dragon: '#7766EE',
  dark: '#775544',
  steel: '#AAAABB',
  fairy: '#FFAAFF',
};

// Mapeo de nombres de estadísticas
export const STAT_NAMES = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

// Colores para las estadísticas
export const STAT_COLORS = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

// Configuración de la aplicación
export const APP_CONFIG = {
  POKEMON_LIMIT: 60,
  SEARCH_DEBOUNCE: 300,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
};

// Textos de la aplicación
export const TEXTS = {
  search_placeholder: 'Buscar Pokémon por nombre o ID...',
  no_results: 'No se encontraron Pokémon',
  loading: 'Cargando...',
  loading_more: 'Cargando más Pokémon...',
  error: 'Ocurrió un error',
  favorites: 'Favoritos',
  no_favorites: 'No tienes Pokémon favoritos',
  height: 'Altura',
  weight: 'Peso',
  abilities: 'Habilidades',
  stats: 'Estadísticas',
  evolutions: 'Evoluciones',
  types: 'Tipos',
  filter_by_type: 'Filtrar por tipo',
  clear_filters: 'Limpiar filtros',
  search_global: 'Buscar en todos los Pokémon',
  pull_to_refresh: 'Desliza para actualizar',
};

// Iconos de navegación
export const TAB_ICONS = {
  home: 'home',
  favorites: 'star',
  search: 'search',
};