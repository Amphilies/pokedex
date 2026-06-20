function elementsGenerateShowcase(index) {
    return `
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

function elementSearchPokemon(searchIndex) {
    return `
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