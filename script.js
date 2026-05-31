const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const limit = "?limit=";
const offset = "&offset=";
let limitValue = 10;
let offsetValue = 0;

let pokemonLimit = 51;
let currentPokemonLimit = 40;
let currentPokemonIndex;


function init() {
    renderPokemonShowcase();
}

function renderPokemonShowcase() { // index < 1024
    for (let index = 0; index < 40; index++) {
        loadPokemonData(index);
        currentPokemonIndex = index;
    }
}

function loadMorePokemon() {
    currentPokemonLimit += 40;
    pokemonLimit += 40;

    for (let index = currentPokemonLimit; index < pokemonLimit; index++) {
        document.getElementById(`showcase_id${index}`).classList.remove("d-none");
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
function loadPokemonCardData(pokemonIndex) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + (pokemonIndex + 1));
            let pokemon = await response.json();

            document.getElementById('pokemon_card_id').innerText = `#${pokemon.id}`;
            document.getElementById('pokemon_card_name').innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById('pokemon_card_image').src = POKEMON_IMG_URL + pokemon.id + ".png";
            for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
                let pokemonTypeIcon = pokemon.types[typeIndex].type.name;
                document.getElementById(`type_icon${typeIndex + 1}_${pokemonIndex}`).src = `./img/${pokemonTypeIcon}.svg`;
                if (!pokemon.types[1]) {
                    document.getElementById(`type_icon2_${pokemonIndex}`).classList.add("d-none");
                }
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function openPokemonCard(pokemonIndex) {
    loadPokemonCardData(pokemonIndex);

    setTimeout(() => {
        document.getElementById(`pokemon_card`).showModal();
    }, 100);
}

function closePokemonCard() {
    document.getElementById('pokemon_card').close();
}


function generate() {
    for (let i = 40; i < 1024; i++) {
        document.getElementById('pokemon_showcase').innerHTML += `
                    <div id="showcase_id${i}" class="b df-c-c-c pokemon-showcase d-none">
                        <div class="pokemon-showcase-header df-spb-c">
                            <h3 id="pokemon_id${i}"></h3>
                            <h3 id="pokemon_name${i}"></h3>
                            <div></div>
                        </div>
                        <div onclick="openPokemonCard(${i})" class="pokemon-showcase-img-container df-c-c">
                            <img id="pokemon_image${i}" src="" alt="Pokemon">
                        </div>
                        <div class="df-spa-c pokemon-showcase-type-container">
                            <img id="type_icon1_${i}" src="" alt="">
                            <img id="type_icon2_${i}" src="" alt="">
                        </div>
                    </div>`;
    }
}


// closePokemonCard
// loadPokemonDetails
// previousPokemon
// nextPokemon