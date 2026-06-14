const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const limit = "?limit=";
const offset = "&offset=";
let pokemonStartValue = 0;
let pokemonLimitValue = 40;
const pokemonLimit = 1025;

async function init() {
    startLoadingSpinner();
    await renderPokemonShowcase();
    stopLoadingSpinner();
}

async function renderPokemonShowcase() {
    generateElementPokemonShowcases();
    loadPokemonInformations();
}

function generateElementPokemonShowcases() {
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        document.getElementById('pokemon_showcase').innerHTML += `
                <div id="showcase_id${index}" class="b df-c-c-c pokemon-showcase">
                    <div class="pokemon-showcase-header df-spb-c">
                        <h3 class="pokemon-id" id="pokemon_id${index}"></h3>
                        <h3 class="pokemon-title" id="pokemon_name${index}"></h3>
                        <div class="pokemon-id"></div>
                    </div>
                    <div id="showcase_img${index}" onclick="openPokemonCard(${index})" class="pokemon-showcase-img-container df-c-c ">
                        <img id="pokemon_image${index}" src="" alt="Pokemon">
                    </div>
                    <div class="df-spa-c pokemon-showcase-type-container">
                        <img id="type_icon1_${index}" src = "" alt="">
                        <img id="type_icon2_${index}" src = "" alt="">
                    </div>
                </div>
        `;
    }
}

function loadPokemonInformations() {
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        fetchPokemonData(index).then(pokemonData => {
            document.getElementById(`pokemon_id${index}`).innerText = `#${convertPokemonId(pokemonData)}`;
            document.getElementById(`pokemon_name${index}`).innerText = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
            document.getElementById(`pokemon_image${index}`).src = `${POKEMON_IMG_URL}${pokemonData.id}.png`;
            document.getElementById(`showcase_img${index}`).classList.add(pokemonData.types[0].type.name);

            for (let typeIndex = 0; typeIndex < pokemonData.types.length; typeIndex++) {
                let pokemonTypeIcon = pokemonData.types[typeIndex].type.name;
                document.getElementById(`type_icon${typeIndex + 1}_${index}`).src = `./img/${pokemonTypeIcon}.svg`;
                if (!pokemonData.types[1]) {
                    document.getElementById(`type_icon2_${index}`).classList.add("d-none");
                }
            }
        });
    }
}

async function fetchPokemonData(pokemonIndex) {
    const response = await fetch(`${POKEMON_BASE_URL}pokemon/${pokemonIndex + 1}`);
    const data = await response.json();
    return data;
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
    }, 1500);
}

async function loadMorePokemon() {
    pokemonLimitValue += 40;
    pokemonStartValue += 40;
    init();
}

function convertPokemonId(pokemonData) {
    if (pokemonData.id.toString().length == 1) {
        return "00" + pokemonData.id;
    } else if (pokemonData.id.toString().length == 2) {
        return "0" + pokemonData.id;
    } else {
        return pokemonData.id;
    }
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

function loadPokemonCardData(pokemonIndex) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await fetch(POKEMON_BASE_URL + "pokemon/" + (pokemonIndex + 1));
            let pokemon = await response.json();
            document.getElementById('pokemon_card_id').innerText = `#${convertPokemonId(pokemon)} `;
            document.getElementById('pokemon_card_name').innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            document.getElementById('pokemon_card_image').src = POKEMON_IMG_URL + pokemon.id + ".png";
            // document.getElementById('card_image').classList.add(pokemon.types[0].type.name);
            document.getElementById('card_image').classList.replace(document.getElementById('card_image').classList[2], pokemon.types[0].type.name);
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

            document.getElementById('hp_progress').style.width = `${pokemon.stats[0].base_stat}% `;
            document.getElementById('hp_progress').innerText = `${pokemon.stats[0].base_stat} `;
            document.getElementById('attack_progress').style.width = `${pokemon.stats[1].base_stat}% `;
            document.getElementById('attack_progress').innerText = `${pokemon.stats[1].base_stat} `;
            document.getElementById('defense_progress').style.width = `${pokemon.stats[2].base_stat}% `;
            document.getElementById('defense_progress').innerText = `${pokemon.stats[2].base_stat} `;
            document.getElementById('special_attack_progress').style.width = `${pokemon.stats[3].base_stat}% `;
            document.getElementById('special_attack_progress').innerText = `${pokemon.stats[3].base_stat} `;
            document.getElementById('special_defense_progress').style.width = `${pokemon.stats[4].base_stat}% `;
            document.getElementById('special_defense_progress').innerText = `${pokemon.stats[4].base_stat} `;
            document.getElementById('speed_progress').style.width = `${pokemon.stats[5].base_stat}% `;
            document.getElementById('speed_progress').innerText = `${pokemon.stats[5].base_stat} `;

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

function closePokemonCard() {
    document.getElementById('pokemon_card').close();
    document.getElementById('body').classList.remove("no-scroll");
}

async function searchPokemon() {
    startLoadingSpinner();
    document.getElementById('pokemon_showcase').innerHTML = "";

    let searchInput = document.getElementById('search_input').value.toLowerCase();
    for (let searchIndex = 0; searchIndex < pokemonLimit; searchIndex++) {
        const response = await fetch(`${POKEMON_BASE_URL}pokemon/${searchIndex + 1}`);
        const data = await response.json();
        let pokemonName = data.name;
        let pokemonId = data.id;
        if (searchInput.length < 3) {
            document.getElementById('search_input').value = "";
            init();
            return alert("min. 3 letters");
        }
        if (data.name.includes(searchInput)) {
            generateSearchingPokemon(searchIndex);
            document.getElementById(`pokemon_id${searchIndex}`).innerText = `#${convertPokemonId(data)}`;
            document.getElementById(`pokemon_name${searchIndex}`).innerText = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            document.getElementById(`pokemon_image${searchIndex}`).src = `${POKEMON_IMG_URL}${pokemonId}.png`;
            document.getElementById(`showcase_img${searchIndex}`).classList.add(data.types[0].type.name);
            for (let typeIndex = 0; typeIndex < data.types.length; typeIndex++) {
                let pokemonTypeIcon = data.types[typeIndex].type.name;
                document.getElementById(`type_icon${typeIndex + 1}_${searchIndex}`).src = `./img/${pokemonTypeIcon}.svg`;
                if (!data.types[1]) {
                    document.getElementById(`type_icon2_${searchIndex}`).classList.add("d-none");
                }
            }
        } else {
            console.log("not found");
        }
    }
    stopLoadingSpinner();
}

function hideOtherPokemons(searchIndex) {
    if (searchIndex < pokemonLimitValue) {
        document.getElementById(`showcase_id${searchIndex}`).classList.add('d-none');
    }
}

function generateSearchingPokemon(searchIndex) {
    document.getElementById('pokemon_showcase').innerHTML += `
                <div id="showcase_id${searchIndex}" class="b df-c-c-c pokemon-showcase">
                    <div class="pokemon-showcase-header df-spb-c">
                        <h3 class="pokemon-id" id="pokemon_id${searchIndex}"></h3>
                        <h3 class="pokemon-title" id="pokemon_name${searchIndex}"></h3>
                        <div class="pokemon-id"></div>
                    </div>
                    <div id="showcase_img${searchIndex}" onclick="openPokemonCard(${searchIndex})" class="pokemon-showcase-img-container df-c-c ">
                        <img id="pokemon_image${searchIndex}" src="" alt="Pokemon">
                    </div>
                    <div class="df-spa-c pokemon-showcase-type-container">
                        <img id="type_icon1_${searchIndex}" src = "" alt="">
                        <img id="type_icon2_${searchIndex}" src = "" alt="">
                    </div>
                </div>
        `;
}

// Such Button designen
// meldung erstellen wenn keine pokemon gefunden werden
// 3.6 Lagere HTML Templates aus in extra-Funktionen
// 4.3 data-id="not-found" auf dem "No match found."-Paragraphen (im JS)
// 6.5 werden keine passenden Pokemon gefunden, zeige eine entsprechende Meldung an