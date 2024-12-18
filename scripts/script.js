const body = document.querySelector("body");
const selectList = document.querySelector("#selectList");
const url = "https://pokeapi.co/api/v2/";
const renderList = document.getElementById("pokemon-list");
const renderPokemonSpecies = document.getElementById("pokemon-species");
const renderPokemon = document.getElementById("pokemon");
let list = document.querySelector("#selectList");

// Get list for sorting
function getList(property) {
  fetch(url + property + "/?limit=999")
    .then((data) => data.json())
    .then((jsonData) => {
      const results = jsonData.results;
      results.forEach((element) => {
        let option = document.createElement("option");
        option.value = element.url;
        option.innerText = element.name;
        selectList.append(option);
      });
    });
}

// Add display option limit
function createLimit() {
  let limit = {
    limit: ["20", "50", "100", "All"],
  };

  const source = document.getElementById("listLimit-template").innerHTML;
  const template = Handlebars.compile(source);
  const html = template(limit);
  document.getElementById("listLimit").innerHTML = html;
}

function selectLimit(limitValue) {
  let selectObject = document.getElementById("selectList");
  selectOption(selectObject);
}

// Display the list of pokemon
function selectOption(selectObject) {
  let value = selectObject.value;
  let listLimitValue = document.querySelector("#listLimit");
  fetch(value)
    .then((data) => data.json())
    .then((jsonData) => {
      jsonData = checkJsonData(jsonData, listLimitValue);
      const source = document.getElementById("pokemonList-template").innerHTML;
      const template = Handlebars.compile(source);
      const html = template(jsonData);
      renderPokemonSpecies.style.display = "none";
      renderList.innerHTML = html;
      renderList.style.display = "inherit";
    });
  document.addEventListener("click", displayPokemon);
}

function displayPokemon(event) {
  if (event.target.className === "pokemon-link") {
    event.preventDefault();
    fetch(event.target.href)
      .then((data) => data.json())
      .then((jsonData) => {
        renderList.style.display = "none";
        const source = document.getElementById(
          "pokemonSpecies-template"
        ).innerHTML;
        const template = Handlebars.compile(source);
        const html = template(jsonData);
        renderPokemonSpecies.innerHTML = html;
        renderPokemonSpecies.style.display = "inherit";
        renderPokemon.innerHTML = "";
        for (let index = 0; index < jsonData.varieties.length; index++) {
          const element = jsonData.varieties[index];
          fetch(element.pokemon.url)
            .then((data) => data.json())
            .then((jsonData) => {
              console.log(jsonData);
              const source =
                document.getElementById("pokemon-template").innerHTML;
              const template = Handlebars.compile(source);
              const html = template(jsonData);
              renderPokemon.insertAdjacentHTML("beforeend",html);
            });
          console.log(element);
        }
      });
  }
}

// Check for response structure
function checkJsonData(jsonData, listLimitValue) {
  if (listLimitValue.value !== "All") {
    if (typeof jsonData.pokemon_species !== "undefined") {
      jsonData.pokemon_species = jsonData.pokemon_species.slice(
        0,
        Number(listLimitValue.value)
      );

      return jsonData;
    } else if (typeof jsonData.pokemon !== "undefined") {
      jsonData.pokemon = jsonData.pokemon.slice(
        0,
        Number(listLimitValue.value)
      );
      return jsonData;
    } else {
      return jsonData;
    }
  } else {
    return jsonData;
  }
}

//Check for body.id value
if (typeof body.id !== "undefined" && body.id !== "") {
  window.addEventListener("load", getList(body.id));
  createLimit();
}
