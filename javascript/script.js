
let nextPageUrl = "https://pokeapi.co/api/v2/pokemon?limit=20";


const pokemonList = document.getElementById("pokemon-list");


async function fetchPokemons() {
  try {
    
    const response = await fetch(nextPageUrl);
    const data = await response.json();

    
    const sortedPokemons = data.results.sort((a, b) => {
      const idA = getPokemonIdFromUrl(a.url);
      const idB = getPokemonIdFromUrl(b.url);
      return idA - idB;
    });

    
    displayPokemons(sortedPokemons);

    
    nextPageUrl = data.next;
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
    pokemonList.innerHTML = "<p class='text-center text-danger'>Não foi possível carregar os Pokémon. Tente novamente.</p>";
  }
}


function getPokemonIdFromUrl(url) {
  const id = url.split("/")[6]; 
  return parseInt(id, 10);
}


function displayPokemons(pokemons) {
  pokemons.forEach(async (pokemon) => {
    try {
      const response = await fetch(pokemon.url);
      const details = await response.json();

      
      const card = document.createElement("div");
      card.classList.add("col-md-3", "mb-4");

      
      card.innerHTML = `
        <div class="card shadow-sm" data-id="${details.id}">
          <img src="${details.sprites.front_default}" class="card-img-top" alt="${details.name}">
          <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${details.name}</h5>
            <p class="card-text">
              Tipo: ${details.types.map(type => `<span class="badge bg-primary">${type.type.name}</span>`).join(" ")}
            </p>
          </div>
        </div>
      `;

      
      card.addEventListener("click", () => showPokemonDetails(details.id));

      
      pokemonList.appendChild(card);
    } catch (error) {
      console.error(`Erro ao buscar detalhes do Pokémon ${pokemon.name}:`, error);
    }
  });
}


async function searchPokemon(event) {
  event.preventDefault(); 

  const query = searchBar.value.trim().toLowerCase(); 
  if (!query) return; 

  try {
    
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (!response.ok) throw new Error("Pokémon não encontrado!");

    const details = await response.json();


    pokemonList.innerHTML = `
      <div class="col-md-4 offset-md-4">
        <div class="card shadow-sm">
          <img src="${details.sprites.front_default}" class="card-img-top" alt="${details.name}">
          <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${details.name}</h5>
            <p class="card-text">
              Tipo: ${details.types?.map(type => `<span class="badge bg-info">${type.type.name}</span>`).join(" ") || "N/A"}
            </p>
            <p class="card-text">
              Altura: <strong>${(details.height / 10).toFixed(1)} m</strong>
            </p>
            <p class="card-text">
              Peso: <strong>${(details.weight / 10).toFixed(1)} kg</strong>
            </p>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error.message);
    pokemonList.innerHTML = `
      <p class="text-center text-danger fw-bold">
        Pokémon não encontrado! Verifique o nome ou número e tente novamente.
      </p>`;
  }
}


const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && searchBar.value.trim() !== "") {
    searchPokemon(event);
  }
});


function handleScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.innerHeight + window.scrollY;

  
  if (scrollHeight - scrollPosition <= 1) {
    if (nextPageUrl) {
      fetchPokemons();
    }
  }
}


window.addEventListener("scroll", handleScroll);


fetchPokemons();


async function showPokemonDetails(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const details = await response.json();

    
    document.getElementById("pokemon-name").textContent = details.name;
    document.getElementById("pokemon-types").textContent = details.types.map(type => type.type.name).join(", ");
    document.getElementById("pokemon-height").textContent = `${(details.height / 10).toFixed(1)} m`;
    document.getElementById("pokemon-weight").textContent = `${(details.weight / 10).toFixed(1)} kg`;
    document.getElementById("pokemon-image").src = details.sprites.front_default;

    
    const myModal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    myModal.show();
  } catch (error) {
    console.error(`Erro ao carregar detalhes do Pokémon ${id}:`, error);
  }
}

