document.addEventListener("DOMContentLoaded", () => {
  const pokemonContainer = document.getElementById("pokemon-container");

  window.addEventListener("load", () => {
    const progressIndicator = document.getElementById("progress-indicator");
    progressIndicator.style.opacity = "0"; // Hide the progress indicator
  });
  window.addEventListener("scroll", () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
    const progressIndicator = document.getElementById("progress-indicator-scroll");
    progressIndicator.style.width = `${scrolledPercentage}%`;
  });

  let pokemonList = [];
  let currentIndex = 0;
  const batchSize = 20; // Number of Pokémon cards to render initially and on each lazy load

  // Step 1: Fetch data from a public API
  async function fetchData() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const fetchPromises = data.results.map(async (pokemon) => {
        const apiUrl = pokemon.url;
        const pokemonResponse = await fetch(apiUrl);
        if (!pokemonResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const pokemonData = await pokemonResponse.json();
        pokemonList.push(pokemonData);
      });

      // Wait for all fetch requests to complete before proceeding
      await Promise.all(fetchPromises);

      // After all data is fetched, inject the initial batch of Pokémon data
      injectPokemonData();
    } catch (error) {
      console.error("There was a problem fetching the data:", error);
    }
  }

  async function fetchPokemonImage(pokemonName) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const pokemonData = await response.json();
      const imageUrl = pokemonData.sprites.front_default;
      return imageUrl;
    } catch (error) {
      console.error("There was a problem fetching the Pokémon image:", error);
      return null;
    }
  }

  fetchData();

  function injectPokemonData() {
    const endIndex = currentIndex + batchSize;
    for (let i = currentIndex; i < endIndex && i < pokemonList.length; i++) {
      const pokemon = pokemonList[i];
      fetchPokemonImage(pokemon.name)
        .then((imageUrl) => {
          const pokemonCard = document.createElement("div");
          pokemonCard.classList.add("pokemon-card");
          pokemonCard.innerHTML = `
            <div class="pokemon-header">
              <h2 class="pokemon-name">${pokemon.name}</h2>
              <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-details">
              <p class="pokemon-type">Base_stats:${pokemon.base_experience}</p>
              <p class="pokemon-ability">Abilities: ${pokemon.abilities[0].ability.name}, ${pokemon.abilities[1].ability.name}</p>
              <p class="pokemon-height">Height: ${pokemon.height}</p>
              <p class="pokemon-weight">Weight: ${pokemon.weight}</p>
              <button class="play-button">Play Audio</button>
            </div>
          `;
          pokemonContainer.appendChild(pokemonCard);

          // Add event listener to the play button inside each card
          const playButton = pokemonCard.querySelector(".play-button");
          playButton.addEventListener("click", () => {
            const audioUrl = pokemon.cries.latest;
            const audio = new Audio(audioUrl);
            audio
              .play()
              .then(() => {
                console.log("Audio playback started successfully");
              })
              .catch((error) => {
                console.error("Error playing audio:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Failed to fetch Pokemon image:", error);
        });
    }
    currentIndex = endIndex;

    // Check if there are more Pokémon to load
    if (currentIndex < pokemonList.length) {
      window.addEventListener("scroll", handleScroll);
    }
  }

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      // User has scrolled near the bottom, load more Pokémon
      injectPokemonData();

      // Remove the scroll event listener if all Pokémon have been loaded
      if (currentIndex >= pokemonList.length) {
        window.removeEventListener("scroll", handleScroll);
      }
    }
  }
});