const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const limit = "?limit=";
const offset = "&offset=";
let limitValue = 10;
let offsetValue = 0;

let test = 0;


function init() {
    renderPokemonShowcase();
}

async function renderPokemonShowcase() {
    test;
    let responsePokemonLimit = await fetch(POKEMON_BASE_URL + limit + limitValue + offset + offsetValue);
    let pokemonImage = POKEMON_IMG_URL;
    let pokemonLimit = await responsePokemonLimit.json();
    let responsePokemon = await fetch(POKEMON_BASE_URL + (1 + test));
    let pokemon = await responsePokemon.json();
    console.log(test);
    
    
    for (let index = 0; index < limitValue; index++) {

        let pokemonName = pokemonLimit.results[index].name;
        document.getElementById('pokemon_showcase').innerHTML += `
                <div class="b df-c-c-c pokemon-showcase">
                    <div class="pokemon-showcase-header df-spb-c">
                        <h3># ${index + 1}</h3>
                        <h3>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
                        <div></div>
                    </div>
                    <div class="pokemon-showcase-img-container df-c-c">
                        <img src="${pokemonImage + (index + 1)}.png" alt="Pokemon">
                    </div>
                    <div class="df-spa-c pokemon-showcase-type-container">

                        ${renderPokemonTypes(pokemon)}

                    </div>
                </div>
        `;
        test++;
        console.log(test);
    }
    
    
}

function renderPokemonTypes(pokemon) {
    let typeRef = '';

    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let pokemonTypeIcon = pokemon.types[typeIndex].type.name
        typeRef += getElementPokemonTypes(pokemonTypeIcon);
    }

    return typeRef;
}

function getElementPokemonTypes(pokemonTypeIcon) {
    return `
        <img class="type-icon" src="./img/${pokemonTypeIcon}.svg" alt="">`
}
// loadPokemonShowcase
// renderPokemonTypes
// loadMorePokemon

// openPokemonCard
// closePokemonCard
// loadPokemonDetails
// previousPokemon
// nextPokemon
