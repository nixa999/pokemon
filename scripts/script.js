const body = document.querySelector("body");
const selectList = document.querySelector("#selectList");
const url = "https://pokeapi.co/api/v2/";
let list = document.querySelector("#selectList");

function getList(property) {
  fetch(url + property + "/?limit=999")
    .then((data) => data.json())
    .then((jsonData) => {
      const results = jsonData.results;
      console.log(jsonData);
      results.forEach((element) => {
        let option = document.createElement("option");
        option.value = element.url;
        option.innerText = element.name;
        selectList.append(option);
      });
    });
}

function createLimit() {
  let limit = {
    limit: ["20", "50", "100", "All"],
  };

  const source = document.getElementById("listLimit-template").innerHTML;
  const template = Handlebars.compile(source);
  const html = template(limit);
  document.getElementById("listLimit").innerHTML = html;
}

function selectOption(selectObject) {
  let value = selectObject.value;
  let listLimitValue = document.querySelector("#listLimit");
  fetch(value)
    .then((data) => data.json())
    .then((jsonData) => {
      if (listLimitValue.value !== "All") {
        jsonData.pokemon_species = jsonData.pokemon_species.slice(
          0,
          Number(listLimitValue.value)
        );
      }
      const source = document.getElementById("pokemon-template").innerHTML;
      const template = Handlebars.compile(source);
      const html = template(jsonData);
      document.getElementById("pokemon-list").innerHTML = html;
    });
}

if (typeof body.id !== "undefined" && body.id !== "") {
  window.addEventListener("load", getList(body.id));
  const listLimit = createLimit();
}
