function elementsGenerateShowcase(pokemonIndex, pokemonImage, pokemonData) {
    return `
            <li id="showcase_id${pokemonIndex}" class="b df-c-c-c pokemon-showcase">
                <div class="pokemon-showcase-header">
                    <h3 class="pokemon-id" id="pokemon_id${pokemonIndex}">#${convertPokemonId(pokemonData)}</h3>
                    <h3 class="pokemon-title" id="pokemon_name${pokemonIndex}">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h3>
                    <div class="pokemon-id"></div>
                </div>
                <button id="showcase_img${pokemonIndex}" onclick="openPokemonCard(${pokemonIndex})" class="pokemon-showcase-img-container df-c-c ${pokemonData.types[0].type.name}">
                    <img id="pokemon_image${pokemonIndex}" src="${pokemonImage}" class="pokemon-showcase-img" alt="Pokemon ${pokemonData.name}">
                </button>
                <div class="df-spa-c pokemon-showcase-type-container">
                    <img id="type_icon1_${pokemonIndex}" src = "" alt="pokemon type ${pokemonData.types[0].type.name}">
                    <img id="type_icon2_${pokemonIndex}" src = "" alt="pokemon type ${pokemonData.types[1] ? pokemonData.types[1].type.name : ''}">
                </div>
            </li>
        `;
}