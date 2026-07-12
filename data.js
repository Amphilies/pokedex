const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
let pokemonData = [];

let pokemonStartValue = 0;
let pokemonLimitValue = 40;
const pokemonLimit = 1025;

// load more overlay
// fontsize min. 16px