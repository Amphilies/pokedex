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

function checkCacheData() {
    for (let pokemonIndex = pokemonStartValue; pokemonIndex < pokemonLimitValue; pokemonIndex++) {
        getData(pokemonIndex);
    }
}

async function getData(pokemonIndex) {
    const cacheVersion = 1;
    const cacheName = `myapp-${cacheVersion}`;
    const url = POKEMON_BASE_URL + `pokemon/${pokemonIndex + 1}`;
    let cachedData = await getCachedData(cacheName, url);
    if (cachedData) {
        loadPokemonInformations(pokemonIndex, cachedData);
        return cachedData;
    }
    const cacheStorage = await caches.open(cacheName);
    await cacheStorage.add(url);
    cachedData = await getCachedData(cacheName, url);
    await deleteOldCaches(cacheName);
    return cachedData;
}
// Get data from the cache.
async function getCachedData(cacheName, url) {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
        return false;
    }

    return await cachedResponse.json();
}
// Delete any old caches to respect user's disk space.
async function deleteOldCaches() {
    const cacheVersion = 1;
    const cacheName = `myapp-${cacheVersion}`;
    const keys = await caches.keys();
    for (const key of keys) {
        const isOurCache = key.startsWith("myapp-");
        if (cacheName === key || !isOurCache) {
            continue;
        }
        caches.delete(key);
    }
    try {
        const data = await getData();
    } catch (error) {
        console.error({ error });
    }
}

async function renderPokemonShowcase() {
    generateElementPokemonShowcases();
    checkCacheData();
}

function generateElementPokemonShowcases() {
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        document.getElementById('pokemon_showcase').innerHTML += elementsGenerateShowcase(index);
    }
}

function loadPokemonInformations(pokemonIndex, cachedData) {
    document.getElementById(`pokemon_id${pokemonIndex}`).innerText = `#${cachedData.id}`;
    document.getElementById(`pokemon_id${pokemonIndex}`).innerText = `#${convertPokemonId(cachedData)}`;
    document.getElementById(`pokemon_name${pokemonIndex}`).innerText = cachedData.name.charAt(0).toUpperCase() + cachedData.name.slice(1);
    document.getElementById(`pokemon_image${pokemonIndex}`).src = `${POKEMON_IMG_URL}${cachedData.id}.png`;
    document.getElementById(`showcase_img${pokemonIndex}`).classList.add(cachedData.types[0].type.name);

    for (let typeIndex = 0; typeIndex < cachedData.types.length; typeIndex++) {
        let pokemonTypeIcon = cachedData.types[typeIndex].type.name;
        document.getElementById(`type_icon${typeIndex + 1}_${pokemonIndex}`).src = `./img/${pokemonTypeIcon}.svg`;
        if (!cachedData.types[1]) {
            document.getElementById(`type_icon2_${pokemonIndex}`).classList.add("d-none");
        }
    }
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

function loadMorePokemon() {
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
            document.getElementById('card_image').classList.add(pokemon.types[0].type.name);
            document.getElementById('card_image').classList.replace(document.getElementById('card_image').classList[2], pokemon.types[0].type.name);
            if (pokemon.types.length >= 2) {
                document.getElementById(`card_type_icon1_0`).src = `./img/${pokemon.types[0].type.name}.svg`;
                document.getElementById(`card_type_icon2_1`).src = `./img/${pokemon.types[1].type.name}.svg`;
                document.getElementById(`card_type_icon2_1`).classList.remove('d-none');
                return
            }
            if (pokemon.types.length = 1) {
                document.getElementById(`card_type_icon1_0`).src = `./img/${pokemon.types[0].type.name}.svg`;
                document.getElementById(`card_type_icon2_1`).classList.add('d-none');
                return
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
            generateSearchingPokemonInformation(searchIndex, pokemonName, pokemonId, data);
        } else {
            console.log("not found");
        }
    }
    stopLoadingSpinner();
}

function generateSearchingPokemonInformation(searchIndex, pokemonName, pokemonId, data) {
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
}

function hideOtherPokemons(searchIndex) {
    if (searchIndex < pokemonLimitValue) {
        document.getElementById(`showcase_id${searchIndex}`).classList.add('d-none');
    }
}

function generateSearchingPokemon(searchIndex) {
    document.getElementById('pokemon_showcase').innerHTML += elementSearchPokemon(searchIndex);
}

// meldung erstellen wenn keine pokemon gefunden werden
// 3.6 Lagere HTML Templates aus in extra-Funktionen
// 4.3 data-id="not-found" auf dem "No match found."-Paragraphen (im JS)
// 6.5 werden keine passenden Pokemon gefunden, zeige eine entsprechende Meldung an