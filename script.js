const POKEMON_BASE_URL = "https://pokeapi.co/api/v2/";
const POKEMON_IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const CACHE_VERSION = 1;
const CACHE_NAME = `myapp-${CACHE_VERSION}`;

let pokemonStartValue = 0;
let pokemonLimitValue = 40;
const pokemonLimit = 1025;

async function init() {
    startLoadingSpinner();
    try {
        await renderPokemonShowcase();
        await deleteOldCaches(CACHE_NAME);
    } catch (error) {
        console.error("Init failed:", error);
        document.getElementById('pokemon_showcase').innerHTML =
            '<div class="no-found">Fehler beim Laden der Pokémon.</div>';
    } finally {
        stopLoadingSpinner();
    }
}

async function renderPokemonShowcase() {
    generateElementPokemonShowcases();   // erstellt leere Karten
    await checkCacheData();              // füllt die Karten mit Daten
}

async function checkCacheData() {
    const promises = [];
    for (let pokemonIndex = pokemonStartValue; pokemonIndex < pokemonLimitValue; pokemonIndex++) {
        promises.push(getData(pokemonIndex));
    }
    await Promise.all(promises);
}

async function getData(pokemonIndex) {
    // Schutz gegen NaN/undefined
    if (!Number.isInteger(pokemonIndex) || pokemonIndex < 0 || pokemonIndex >= pokemonLimit) {
        throw new Error(`Invalid pokemonIndex: ${pokemonIndex}`);
    }

    const url = `${POKEMON_BASE_URL}pokemon/${pokemonIndex + 1}`;

    // 1) Cache prüfen
    let data = await getCachedData(CACHE_NAME, url);
    if (data) {
        loadPokemonInformations(pokemonIndex, data);
        return data;
    }

    // 2) Wenn nicht im Cache: vom Netzwerk holen, in Cache schreiben, anzeigen
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Fetch failed for ${url} with status ${response.status}`);
    }

    const cacheStorage = await caches.open(CACHE_NAME);
    await cacheStorage.put(url, response.clone());

    data = await response.json();
    loadPokemonInformations(pokemonIndex, data);
    return data;
}

async function getCachedData(cacheName, url) {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) return null;
    return await cachedResponse.json();
}

async function deleteOldCaches(currentCacheName) {
    const keys = await caches.keys();

    for (const key of keys) {
        const isOurCache = key.startsWith("myapp-");
        if (isOurCache && key !== currentCacheName) {
            await caches.delete(key);
        }
    }
}

function loadMorePokemon() {
    pokemonStartValue = pokemonLimitValue;
    pokemonLimitValue = Math.min(pokemonLimitValue + 40, pokemonLimit);
    init();
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
    const searchInputElement = document.getElementById('search_input');
    const searchInput = searchInputElement.value.toLowerCase().trim();
    let found = false;
    if (searchInput.length < 3) {
        searchInputElement.value = "";
        init();
        alert("min. 3 letters");
        return stopLoadingSpinner();
    }
    for (let searchIndex = 0; searchIndex < pokemonLimit; searchIndex++) {
        const response = await fetch(`${POKEMON_BASE_URL}pokemon/${searchIndex + 1}`);
        const data = await response.json();

        if (data.name.includes(searchInput)) {
            found = true;
            generateSearchingPokemon(searchIndex);
            generateSearchingPokemonInformation(searchIndex, data.name, data.id, data);
        }
    }
    if (!found) {
        console.log("Kein Pokémon gefunden für:", searchInput);
        document.getElementById('pokemon_showcase').innerHTML = '<div data-id="not-found" id="no_pokemon_found" class="no-found">No pokemon found</div>';
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