const body = document.querySelector("body");
const selectList = document.querySelector("#selectList");
const url = "https://pokeapi.co/api/v2/";
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

// Display the list of pokemon
function selectOption(selectObject) {
  let value = selectObject.value;
  let listLimitValue = document.querySelector("#listLimit");
  fetch(value)
    .then((data) => data.json())
    .then((jsonData) => {
      jsonData = checkJsonData(jsonData, listLimitValue);
      const source = document.getElementById("pokemon-template").innerHTML;
      const template = Handlebars.compile(source);
      const html = template(jsonData);
      document.getElementById("pokemon-list").innerHTML = html;
    });
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
  }
}

//Check for body.id value
if (typeof body.id !== "undefined" && body.id !== "") {
  window.addEventListener("load", getList(body.id));
  createLimit();
}
