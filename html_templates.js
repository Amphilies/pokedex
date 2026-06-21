function elementsGenerateShowcase(index) {
    return `
            <div id="showcase_id${index}" class="b df-c-c-c pokemon-showcase">
                <div class="pokemon-showcase-header">
                    <h3 class="pokemon-id" id="pokemon_id${index}"></h3>
                    <h3 class="pokemon-title" id="pokemon_name${index}"></h3>
                    <div class="pokemon-id"></div>
                </div>
                <button id="showcase_img${index}" onclick="openPokemonCard(${index})" class="pokemon-showcase-img-container df-c-c ">
                    <img id="pokemon_image${index}" src="" alt="Pokemon">
                </button>
                <div class="df-spa-c pokemon-showcase-type-container">
                    <img id="type_icon1_${index}" src = "" alt="">
                    <img id="type_icon2_${index}" src = "" alt="">
                </div>
            </div>
        `;
}