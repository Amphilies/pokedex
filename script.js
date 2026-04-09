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

function renderPokemonShowcase() {
    for (let index = 0; index < 500; index++) {
        loadPokemonData(index);
        document.getElementById('pokemon_showcase').innerHTML += `
                <div class="b df-c-c-c pokemon-showcase">
                    <div class="pokemon-showcase-header df-spb-c">
                        <h3 id="pokemon_id${index}"></h3>
                        <h3 id="pokemon_name${index}"></h3>
                        <div></div>
                    </div>
                    <div class="pokemon-showcase-img-container df-c-c">
                        <img id="pokemon_image${index}" src="" alt="Pokemon">
                    </div>
                    <div class="df-spa-c pokemon-showcase-type-container">
                        <img id="type_icon1_${index}" src="" alt="">
                        <img id="type_icon2_${index}" src="" alt="">
                    </div>
                </div>
        `;
    }
}

function loadPokemonData(index) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + (index + 1));
            let pokemon = await response.json();

            document.getElementById(`pokemon_id${index}`).innerText = `#${pokemon.id}`;
            document.getElementById(`pokemon_name${index}`).innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById(`pokemon_image${index}`).src = POKEMON_IMG_URL + pokemon.id + ".png";
            for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
                let pokemonTypeIcon = pokemon.types[typeIndex].type.name;
                document.getElementById(`type_icon${typeIndex + 1}_${index}`).src = `./img/${pokemonTypeIcon}.svg`;
                if (!pokemon.types[1]) {
                    document.getElementById(`type_icon2_${index}`).classList.add("d-none");
                }
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function loadMorePokemon() {
    offsetValue += 10;
    limitValue += 10;
    addMorePokemon();
}

// loadMorePokemon

// openPokemonCard
// closePokemonCard
// loadPokemonDetails
// previousPokemon
// nextPokemon
