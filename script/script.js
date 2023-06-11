const search = document.querySelector("#search");
const number = document.querySelector("#number");
const pokemonImage = document.querySelector("#pokemon-image");
const types = document.querySelector("#types");
const statNumber = document.querySelectorAll(".stat-number");
const barInner = document.querySelectorAll(".bar-inner");
const barOuter = document.querySelectorAll(".bar-outer");
const statDesc = document.querySelectorAll(".stat-desc");
const baseStats = document.querySelector("#base-stats");
const pokedex = document.querySelector("#pokedex");
const suggestionsList = document.querySelector("#suggestions-list");
const pokemonName = document.querySelector("#pokemon-name");

const typeColors = {
  rock: [182, 158, 49],
  ghost: [112, 85, 155],
  steel: [183, 185, 208],
  water: [100, 147, 235],
  grass: [116, 203, 72],
  psychic: [251, 85, 132],
  ice: [154, 214, 223],
  dark: [117, 87, 76],
  fairy: [230, 158, 172],
  normal: [170, 166, 127],
  fighting: [193, 34, 57],
  flying: [168, 145, 236],
  poison: [164, 62, 158],
  ground: [222, 193, 107],
  bug: [167, 183, 35],
  fire: [245, 125, 49],
  electric: [249, 207, 48],
  dragon: [112, 55, 255],
};

const fetchApi = async (pkmnName) => {
  const pkmnNameApi = pkmnName.toLowerCase().split(" ").join("-");

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/" + pkmnNameApi
  );

  if (response.status === 200) {
    const pkmnData = await response.json();
    return pkmnData;
  }

  return false;
};

const generateAutocompleteOptions = async (searchValue) => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
  );
  const data = await response.json();
  const pokemonNames = data.results.map((result) => result.name);
  const autocompleteOptions = pokemonNames.filter((name) =>
    name.startsWith(searchValue.toLowerCase())
  );
  return autocompleteOptions;
};

const formatPokemonName = (name) => {
  const words = name.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
};

const transformPokemonData = (pkmnData) => {
  const formattedName = formatPokemonName(pkmnData.name);

  return {
    ...pkmnData,
    name: formattedName,
  };
};

search.addEventListener("input", async (event) => {
  const searchValue = event.target.value;
  const autocompleteOptions = await generateAutocompleteOptions(searchValue);

  suggestionsList.innerHTML = "";

  autocompleteOptions.forEach((option) => {
    const suggestion = document.createElement("option");
    suggestion.value = option;
    suggestionsList.appendChild(suggestion);
  });
});

const form = document.querySelector("form");
const pokedexBorder = document.querySelector("#pokedex");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pkmnData = await fetchApi(search.value);

  if (!pkmnData) {
    alert("Pokémon does not exist.");
    return;
  }

  const transformedData = transformPokemonData(pkmnData);

  const mainColor = typeColors[transformedData.types[0].type.name];
  pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
  number.textContent = `#${transformedData.id.toString().padStart(3, "0")}`;
  pokemonImage.src =
    transformedData.sprites.other["official-artwork"].front_default;

  types.innerHTML = "";
  transformedData.types.forEach((t) => {
    const newType = document.createElement("span");
    const color = typeColors[t.type.name];

    newType.textContent = t.type.name;
    newType.classList.add("type");
    newType.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    types.appendChild(newType);
  });

  transformedData.stats.forEach((s, i) => {
    statNumber[i].textContent = s.base_stat.toString().padStart(3, "0");
    barInner[i].style.width = `${s.base_stat}%`;
    barInner[
      i
    ].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    barOuter[
      i
    ].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
    statDesc[
      i
    ].style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
  });
  baseStats.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;

  const darkenedColor = [
    Math.max(mainColor[0] - 30, 0),
    Math.max(mainColor[1] - 30, 0),
    Math.max(mainColor[2] - 30, 0),
  ];

  pokedexBorder.style.borderColor = `rgb(${darkenedColor[0]}, ${darkenedColor[1]}, ${darkenedColor[2]})`;

  pokemonName.textContent = transformedData.name;

  search.blur();
  pokedex.style.visibility = "visible";
});

search.value = pkmnData.name;
pokemonName.textContent = pkmnData.name;
