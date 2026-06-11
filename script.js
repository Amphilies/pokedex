const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const limit = "?limit=";
const offset = "&offset=";
let limitValue = 40;
let offsetValue = 0;

let pokemonLimit = 40;
let currentPokemonLimit = 0;
currentPokemonIndex = 0;


async function init() {
    startLoadingSpinner()
    await renderPokemonShowcase();
    stopLoadingSpinner();
    loadstatistics();
}

async function renderPokemonShowcase() { // index < 1024
    for (let index = currentPokemonLimit; index < pokemonLimit; index++) {
        loadPokemonData(index);
        currentPokemonIndex = index;
    }
}
function loadPokemonData(index) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + "pokemon/" + (index + 1));
            let pokemon = await response.json();

            document.getElementById(`pokemon_id${index}`).innerText = `#${pokemon.id}`;
            document.getElementById(`pokemon_name${index}`).innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById(`pokemon_image${index}`).src = POKEMON_IMG_URL + pokemon.id + ".png";
            document.getElementById(`showcase_img${index}`).classList.add(pokemon.types[0].type.name);

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
async function loadMorePokemon() {
    currentPokemonLimit += 40;
    pokemonLimit += 40;

    for (let index = currentPokemonLimit; index < pokemonLimit; index++) {
        document.getElementById(`showcase_id${index}`).classList.remove("d-none");
    }
    startLoadingSpinner()
    await renderPokemonShowcase();
    stopLoadingSpinner();
}
function openPokemonCard(pokemonIndex) {
    loadPokemonCardData(pokemonIndex);
    loadPokemonCardStats(pokemonIndex);
    currentPokemonIndex = pokemonIndex;

    setTimeout(() => {
        document.getElementById('pokemon_card').showModal();
        document.getElementById('body').classList.add("no-scroll");
    }, 100);
}
function closePokemonCard() {
    document.getElementById('pokemon_card').close();
    document.getElementById('body').classList.remove("no-scroll");
}
function loadPokemonCardData(pokemonIndex) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + "pokemon/" + (pokemonIndex + 1));
            let pokemon = await response.json();
            document.getElementById('pokemon_card_id').innerText = `#${pokemon.id}`;
            document.getElementById('pokemon_card_name').innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById('pokemon_card_image').src = POKEMON_IMG_URL + pokemon.id + ".png";
            // document.getElementById('card_image').classList.add(pokemon.types[0].type.name);
            document.getElementById('card_image').classList.replace(document.getElementById('card_image').classList[1], pokemon.types[0].type.name);
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
function loadPokemonCardStats(pokemonIndex) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + "pokemon/" + (pokemonIndex + 1));
            let pokemon = await response.json();

            document.getElementById('hp_progress').style.width = `${pokemon.stats[0].base_stat}%`;
            document.getElementById('hp_progress').innerText = `${pokemon.stats[0].base_stat}`;
            document.getElementById('attack_progress').style.width = `${pokemon.stats[1].base_stat}%`;
            document.getElementById('attack_progress').innerText = `${pokemon.stats[1].base_stat}`;
            document.getElementById('defense_progress').style.width = `${pokemon.stats[2].base_stat}%`;
            document.getElementById('defense_progress').innerText = `${pokemon.stats[2].base_stat}`;
            document.getElementById('special_attack_progress').style.width = `${pokemon.stats[3].base_stat}%`;
            document.getElementById('special_attack_progress').innerText = `${pokemon.stats[3].base_stat}`;
            document.getElementById('special_defense_progress').style.width = `${pokemon.stats[4].base_stat}%`;
            document.getElementById('special_defense_progress').innerText = `${pokemon.stats[4].base_stat}`;
            document.getElementById('speed_progress').style.width = `${pokemon.stats[5].base_stat}%`;
            document.getElementById('speed_progress').innerText = `${pokemon.stats[5].base_stat}`;

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}
function previousPokemon() {
    if (currentPokemonIndex <= 0) {
        currentPokemonIndex = 1024;
    } else {
        currentPokemonIndex--;
    }
    loadPokemonCardData(currentPokemonIndex);
    loadPokemonCardStats(currentPokemonIndex);
}
function nextPokemon() {
    if (currentPokemonIndex == 1024) {
        currentPokemonIndex = 0;
    } else {
        currentPokemonIndex++;
    }
    loadPokemonCardData(currentPokemonIndex);
    loadPokemonCardStats(currentPokemonIndex);
}

function startLoadingSpinner() {
    document.getElementById('loading_spinner').classList.remove('d-none');
    document.getElementById('pokemon_showcase').classList.add('d-none');
    document.getElementById('load_more_button').classList.add('d-none');
}
function stopLoadingSpinner() {
    setTimeout(() => {
    document.getElementById('loading_spinner').classList.add('d-none');
    document.getElementById('pokemon_showcase').classList.remove('d-none');
    document.getElementById('load_more_button').classList.remove('d-none');
    }, 1000);
}

async function loadstatistics() {
    let response = await fetch(POKEMON_BASE_URL + "pokemon/" + (0 + 1));
    let pokemon = await response.json();

    console.log(pokemon);
}

