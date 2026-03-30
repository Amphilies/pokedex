const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const limit = "?limit=";
const offset = "&offset=";
let limitValue = 40;
let offsetValue = 0;

let currentIndex;
let totalPokemon;

function init() {
    usePromise();
}

function usePromise() {
    try {
        loadAndShowPokemon();
    } catch (error) {
        console.log("An error at usePromise");
    }
}

async function loadAndShowPokemon() {

    toggleSpinner();

    await loadPokemonCard();

    toggleSpinner();
}

async function loadPokemonCard() {
    let responsePokemonLimit = await fetch(POKEMON_BASE_URL + limit + limitValue + offset + offsetValue);
    let pokemonLimit = await responsePokemonLimit.json();
    document.getElementById('container_card_pokemon').innerHTML = "";
    for (let pokemonIndex = 0; pokemonIndex < limitValue; pokemonIndex++) {
        let responsePokemon = await fetch(POKEMON_BASE_URL + (pokemonIndex + 1))
        let pokemon = await responsePokemon.json();
        let pokemonName = pokemonLimit.results[pokemonIndex].name;
        pokemonName = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
        let pokemonImage = POKEMON_IMG_URL;
        document.getElementById('container_card_pokemon').innerHTML += getElementPokemonCards(pokemon, pokemonIndex, pokemonName, pokemonImage);
        totalPokemon = pokemonLimit.count;
    }
}

async function loadMorePokemon() {
    limitValue += +20;
    loadAndShowPokemon();
}

function toggleSpinner() {
    document.getElementById('load_more').classList.toggle('d-none');
    document.getElementById('loading-spinner').classList.toggle('d-none');
    document.getElementById('container_card_pokemon').classList.toggle('d-none');
}

function renderPokemonTypes(pokemon) {
    let typeRef = '';

    for (let typeIndex = 0; typeIndex < pokemon.types.length; typeIndex++) {
        let pokemonTypeIcon = pokemon.types[typeIndex].type.name
        typeRef += getElementPokemonTypes(pokemonTypeIcon);
    }

    return typeRef;
}

function renderPokemonStats(pokemon) {
    let statsRef = '';

    for (let statIndex = 0; statIndex < pokemon.stats.length; statIndex++) {
        let pokemonStat = pokemon.stats[statIndex].base_stat;
        statsRef += getElementPokemonStats(pokemonStat);
    }

    return statsRef;
}

async function openPokemonCard(pokemonIndex) {
    currentIndex = pokemonIndex;
    document.addEventListener('keyup', keyNavigation);
    pokemonStats(currentIndex);

}

async function pokemonStats(currentIndex) {
    let response = await fetch(POKEMON_BASE_URL + currentIndex);
    let pokemon = await response.json();

    document.getElementById('dialog').showModal();
    document.getElementById('dialog-image').src = POKEMON_IMG_URL + currentIndex + ".png";
    document.getElementById('stat_hp').style.width = pokemon.stats[0].base_stat + "%";
    document.getElementById('stat_attack').style.width = pokemon.stats[1].base_stat + "%";
    document.getElementById('stat_defense').style.width = pokemon.stats[2].base_stat + "%";
    document.getElementById('stat_special_attack').style.width = pokemon.stats[3].base_stat + "%";
    document.getElementById('stat_special_defense').style.width = pokemon.stats[4].base_stat + "%";
    document.getElementById('stat_speed').style.width = pokemon.stats[5].base_stat + "%";

    document.getElementById('body').classList.add('body');

    document.getElementById('stat_hp').innerHTML = pokemon.stats[0].base_stat;
    document.getElementById('stat_attack').innerHTML = pokemon.stats[1].base_stat;
    document.getElementById('stat_defense').innerHTML = pokemon.stats[2].base_stat;
    document.getElementById('stat_special_attack').innerHTML = pokemon.stats[3].base_stat;
    document.getElementById('stat_special_defense').innerHTML = pokemon.stats[4].base_stat;
    document.getElementById('stat_speed').innerHTML = pokemon.stats[5].base_stat;
}

function closePokemonCard() {
    document.querySelector('dialog').close();
    document.getElementById('dialog_prev_button').disabled = false;
    document.getElementById('body').classList.remove('body');
}

function keyNavigation(event) {
    if (event.key === "ArrowLeft") {
        prevPokemon();
    }
    if (event.key === "ArrowRight") {
        nextPokemon();
    }
    if (event.key === 'Escape') {
        closePokemonCard();
    }
}

function prevPokemon() {
    if (currentIndex == 2) {
        currentIndex--;
        document.getElementById('dialog_prev_button').disabled = true;
    } else {
        document.getElementById('dialog_next_button').disabled = false;
        currentIndex--;
    }
    openPokemonCard(currentIndex);
}

function nextPokemon() {
    if (currentIndex == 1024) {
        document.getElementById('dialog_next_button').disabled = true;
    } else {
        document.getElementById('dialog_prev_button').disabled = false;
        currentIndex++;
    }
    openPokemonCard(currentIndex);
}

function searchPokemon() {
    const searchInput = document.getElementById('search_input');
    const pokemonCards = document.querySelectorAll('.card-pokemon');
    pokemonCards.forEach(card => {
        const pokemonName = card.querySelector('#pokemon_name').innerText.toLowerCase();
        const pokemonId = card.querySelector('.pokemon-title').innerText.split('#')[1];
        if (searchInput.value.toString().length >= 3 || searchInput.value) {
            if (pokemonName.includes(searchInput.value.toLowerCase()) || pokemonId.includes(searchInput.value.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        } else {
            card.style.display = 'block';
        }
});
}

function getElementPokemonStats(pokemonStat) {
    return `
        <div class="pokemon-stat">
            <span class="stat-name">${pokemonStat.name}</span>
            <span class="stat-value">${pokemonStat.base_stat}</span>
        </div>`
}

function getElementPokemonCards(pokemon, pokemonIndex, pokemonName, pokemonImage) {
    return `
        <div class="card-pokemon">
            <div class="card-title df-spb-c">
                <span class="pokemon-title">#${pokemonIndex + 1}</span>
                <h2 id="pokemon_name" class="pokemon-title">${pokemonName}</h2>
                <span></span>
            </div>
            <div id="card-pokemon-background${pokemonIndex + 1}" onclick="openPokemonCard(${pokemonIndex + 1})" class="card-pokemon-img ${pokemon.types[0].type.name} df-c-c">
                <img class="pokemon-minature-img" src="${pokemonImage + (pokemonIndex + 1)}.png" alt="">
            </div>
            <div id="container_type" class="card-type">

                ${renderPokemonTypes(pokemon, pokemonIndex)}

            </div>
        </div>`
}

function getElementPokemonTypes(pokemonTypeIcon) {
    return `
        <img class="type-icon" src="./img/${pokemonTypeIcon}.svg" alt="">`
}