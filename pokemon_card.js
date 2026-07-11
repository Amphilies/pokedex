function openPokemonCard(pokemonIndex) {
    try {
        loadPokemonCardData(pokemonIndex);
        loadPokemonCardStats(pokemonIndex);
    } catch (error) {
        console.error("Error opening Pokémon card:", error);
    }

    setTimeout(() => {
        document.getElementById('pokemon_card').showModal();
        document.getElementById('body').classList.add("no-scroll");
    }, 100);
    currentPokemonIndex = pokemonIndex;
}

function loadPokemonCardStats(pokemonIndex) {
    const statIdElements = ['hp_progress', 'attack_progress', 'defense_progress', 'special_attack_progress', 'special_defense_progress', 'speed_progress'];
    statIdElements.forEach((element, index) => {
        document.getElementById(element).style.width = `${pokemonData[pokemonIndex].statistics[index].base_stat}% `;
        document.getElementById(element).innerText = `${pokemonData[pokemonIndex].statistics[index].base_stat}`;
    });
}

async function loadPokemonCardData(index) {
    try {
        const pokemonImage = POKEMON_IMG_URL + (index + 1) + ".png";
        const cache = await caches.open('images');
        let response = await cache.match(pokemonImage);
        if (response) {
            checkAndLoadPokemonImage(response);
        } else {
            loadNotCachedImage(pokemonImage);
        }
        const pokemon = pokemonData[index];
        updatePokemonData(pokemon);
    } catch (error) {
        console.error('loadPokemonCardData error', error);
    }
}

async function checkAndLoadPokemonImage(response) {
    const blob = await response.blob();
    const fetchedUrl = URL.createObjectURL(blob);
    document.getElementById('pokemon_card_image').src = fetchedUrl;
}

function loadNotCachedImage(pokemonImage) {
    document.getElementById('pokemon_card_image').src = pokemonImage;
}

function updatePokemonData(pokemon) {
    document.getElementById('pokemon_card_id').innerText = `#${convertPokemonId(pokemon)} `;
    document.getElementById('pokemon_card_name').innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    if (document.getElementById('card_image') && pokemon.types && pokemon.types[0]) {
        const oldBackground = Array.from(document.getElementById('card_image').classList).find(elements => elements !== 'card-image' && elements !== 'd-none');
        document.getElementById('card_image').classList.remove(oldBackground);
        document.getElementById('card_image').classList.add(pokemon.types[0].type.name);
    }
    const type1 = document.getElementById('card_type_icon1_0');
    const type2 = document.getElementById('card_type_icon2_1');
    if (pokemon.types && pokemon.types.length >= 2) {
        type1.src = `./img/${pokemon.types[0].type.name}.svg`; type1.setAttribute('alt', 'pokemon type ' + pokemon.types[0].type.name);
        type2.src = `./img/${pokemon.types[1].type.name}.svg`; type2.setAttribute('alt', 'pokemon type ' + pokemon.types[1].type.name); type2.classList.remove('d-none');
        return;
    }
    if (pokemon.types && pokemon.types.length === 1) {
        type1.src = `./img/${pokemon.types[0].type.name}.svg`; type1.setAttribute('alt', 'pokemon type ' + pokemon.types[0].type.name);
        type2.classList.add('d-none');
        return;
    }
}

function previousPokemon() {
    const visible = getVisibleIndexes();
    // if (!visible.length) return;
    let pos = visible.indexOf(currentPokemonIndex);
    if (pos === -1) {
        pos = 0;
        currentPokemonIndex = visible[0];
    } else {
        pos = (pos - 1 + visible.length) % visible.length;
        currentPokemonIndex = visible[pos];
    }
    if (visible.length <= 1) {
        document.getElementById('previous_button').setAttribute('disabled', true);
        document.getElementById('next_button').setAttribute('disabled', true);
    } else {
        document.getElementById('previous_button').removeAttribute('disabled');
        document.getElementById('next_button').removeAttribute('disabled');
    }
    loadPokemonCardData(currentPokemonIndex);
    loadPokemonCardStats(currentPokemonIndex);
}

function nextPokemon() {
    const visible = getVisibleIndexes();
    // if (!visible.length) return;
    let pos = visible.indexOf(currentPokemonIndex);
    if (pos === -1) {
        pos = 0;
        currentPokemonIndex = visible[0];
    } else {
        pos = (pos + 1) % visible.length;
        currentPokemonIndex = visible[pos];
    }
    if (visible.length <= 1) {
        document.getElementById('previous_button').setAttribute('disabled', true);
        document.getElementById('next_button').setAttribute('disabled', true);
    } else {
        document.getElementById('previous_button').removeAttribute('disabled');
        document.getElementById('next_button').removeAttribute('disabled');
    }
    loadPokemonCardData(currentPokemonIndex);
    loadPokemonCardStats(currentPokemonIndex);
}

function getVisibleIndexes() {
    const pokemonFounded = [];
    for (let i = 0; i < pokemonLimitValue; i++) {
        const el = document.getElementById('showcase_id' + i);
        const isVisible = el && !el.classList.contains('d-none');
        const markedFound = pokemonData[i] && pokemonData[i].found === true;
        if (isVisible || markedFound) pokemonFounded.push(i);
    }
    return pokemonFounded;
}

function closePokemonCard() {
    document.getElementById('pokemon_card').close();
    document.getElementById('body').classList.remove("no-scroll");
}