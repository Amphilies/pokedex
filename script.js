async function init() {
    startLoadingSpinner();
    try {
        await getPokemonData();
        await renderPokemonShowcase();
    } catch (error) {
        document.getElementById('pokemon_showcase').innerHTML =
            '<div class="no-found">Fehler beim Laden der Pokémon.</div>';
    } finally {
        stopLoadingSpinner();
    }
}

async function getPokemonData() {
    for (let pokemonIndex = pokemonStartValue; pokemonIndex < pokemonLimitValue; pokemonIndex++) {
        const response = await fetch(`${POKEMON_BASE_URL}pokemon/${pokemonIndex + 1}`);
        const pokemonDataToJson = await response.json();
        pokemonData.push({
            id: pokemonDataToJson.id,
            name: pokemonDataToJson.name,
            types: pokemonDataToJson.types,
            image: `${POKEMON_IMG_URL}${pokemonIndex + 1}.png`,
            statistics: pokemonDataToJson.stats,
            found: true
        });
    }
}

async function renderPokemonShowcase() {
    let html = '';
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        const pokemonImage = `${POKEMON_IMG_URL}${index + 1}.png`;
        html += elementsGenerateShowcase(index, pokemonImage, pokemonData[index]);
    }
    document.getElementById('pokemon_showcase').insertAdjacentHTML('beforeend', html);
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        if (!pokemonData[index] || !pokemonData[index].types) continue;
        for (let typeIndex = 0; typeIndex < pokemonData[index].types.length; typeIndex++) {
            document.getElementById(`type_icon${typeIndex + 1}_${index}`).src = `./img/${pokemonData[index].types[typeIndex].type.name}.svg`;
        }
        if (!pokemonData[index].types[1]) {
            document.getElementById(`type_icon2_${index}`).classList.add('d-none');
        }
    }
}

async function loadMorePokemon() {
    pokemonStartValue += 40;
    pokemonLimitValue = Math.min(pokemonLimitValue + 40, pokemonLimit);
    startLoadingSpinner();
    setTimeout(async () => {
        await getPokemonData();
        await renderPokemonShowcase();
        setTimeout(() => {
            stopLoadingSpinner();
        }, 1000);
    }, 2000);
}

async function loadPokemonInformations(pokemonIndex, pokemonData) {
    setPokemonInformations(pokemonIndex, pokemonData);
    for (let index = pokemonStartValue; index < pokemonLimitValue; index++) {
        if (!pokemonData[index] || !pokemonData[index].types) continue;
        for (let typeIndex = 0; typeIndex < pokemonData[index].types.length; typeIndex++) {
            document.getElementById(`type_icon${typeIndex + 1}_${index}`).src = `./img/${pokemonData[index].types[typeIndex].type.name}.svg`;
        }
        if (!pokemonData[index].types[1]) {
            document.getElementById(`type_icon2_${index}`).classList.add('d-none');
        }
    }
}

function setPokemonInformations(pokemonIndex, pokemonData) {
    document.getElementById(`pokemon_id${pokemonIndex}`).innerText = `#${convertPokemonId(pokemonData)}`;
    document.getElementById(`showcase_id${pokemonIndex}`).setAttribute("data-id", `card ${pokemonData.id}`);
    document.getElementById(`pokemon_name${pokemonIndex}`).innerText = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    document.getElementById(`pokemon_image${pokemonIndex}`).setAttribute("alt", "pokemon image " + pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1));
    document.getElementById(`pokemon_image${pokemonIndex}`).src = `${POKEMON_IMG_URL}${pokemonData.id}.png`;
    document.getElementById(`showcase_img${pokemonIndex}`).classList.add(pokemonData.types[0].type.name);
}

function startLoadingSpinner() {
    document.getElementById('loading_spinner').classList.remove('d-none');
    document.getElementById('load_more_button').classList.add('d-none');
}

function stopLoadingSpinner() {
    document.getElementById('loading_spinner').classList.add('d-none');
    document.getElementById('load_more_button').classList.remove('d-none');
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

async function searchPokemon() {
    startLoadingSpinner();
    let found = false;
    if (document.getElementById('search_input').value.toLowerCase().trim().length < 3) {
        return inputError(document.getElementById('search_input'));;}
    for (let searchIndex = 0; searchIndex < pokemonLimitValue; searchIndex++) {
        if (document.getElementById('pokemon_name' + searchIndex).textContent.toLowerCase().trim().includes(document.getElementById('search_input').value.toLowerCase().trim())) {
            found = true;
            searchedPokemonFound(searchIndex);
        } else {
            document.getElementById('showcase_id' + searchIndex).classList.add('d-none');
            pokemonData[searchIndex].found = false;}}
    if (!found) {
        return pokemonNotFound();}
    stopLoadingSpinner();
    document.getElementById('load_more_button').classList.add('d-none');
}

function searchedPokemonFound(searchIndex) {
    document.getElementById('no_found').classList.add('d-none');
    document.getElementById('showcase_id' + searchIndex).classList.remove('d-none');
    document.getElementById('load_more_button').classList.add('d-none');
    document.getElementById('reload_page_button').classList.remove('d-none');
}

function pokemonNotFound() {
    document.getElementById('search_input').placeholder = "Search by Name";
    document.getElementById('error_content').innerHTML = `<p data-id="not-found" id="no_found" class="no-found">No Pokémon found</p>`;
    document.getElementById('reload_page_button').classList.remove('d-none');
    document.getElementById('load_more_button').classList.add('d-none');
    document.getElementById('loading_spinner').classList.add('d-none');
}

function inputError(searchInputElement) {
    searchInputElement.value = "";
    searchInputElement.placeholder = "min. 3 letters";
    stopLoadingSpinner();
}

async function reloadPage() {
    document.getElementById('load_more_button').classList.remove('d-none');
    document.getElementById('no_found').classList.add('d-none');
    document.getElementById('search_input').value = "";
    document.getElementById('reload_page_button').classList.add('d-none');
    for (let index = 0; index < pokemonLimitValue; index++) {
        document.getElementById('showcase_id' + index).classList.remove('d-none');
    }
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
    document.getElementById('pokemon_showcase').innerHTML += elementsGenerateShowcase(searchIndex);
}
