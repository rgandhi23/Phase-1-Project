import { filterAndSortPokemon, normalizePokemon } from "./pokemon.js";

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=60";
const PAGE_SIZE = 18;

const elements = {
  clearFilters: document.querySelector("#clear-filters"),
  container: document.querySelector("#pokemon-container"),
  error: document.querySelector("#error-state"),
  loadMore: document.querySelector("#load-more"),
  loadedCount: document.querySelector("#loaded-count"),
  loading: document.querySelector("#loading-state"),
  resultsCount: document.querySelector("#results-count"),
  retry: document.querySelector("#retry-button"),
  scrollProgress: document.querySelector("#scroll-progress"),
  search: document.querySelector("#search-input"),
  sort: document.querySelector("#sort-select"),
  type: document.querySelector("#type-filter"),
};

const state = {
  pokemon: [],
  visibleCount: PAGE_SIZE,
};

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PokéAPI returned ${response.status}`);
  return response.json();
}

function createPokemonCard(pokemon) {
  const card = document.createElement("article");
  card.className = "pokemon-card";

  const visual = document.createElement("div");
  visual.className = "card-visual";
  visual.style.setProperty("--card-color", pokemon.color);

  const number = document.createElement("span");
  number.className = "card-number";
  number.textContent = `#${String(pokemon.id).padStart(3, "0")}`;

  const image = document.createElement("img");
  image.className = "pokemon-image";
  image.src = pokemon.image;
  image.alt = pokemon.name;
  image.loading = "lazy";
  image.width = 170;
  image.height = 170;
  visual.append(number, image);

  const content = document.createElement("div");
  content.className = "card-content";
  const heading = document.createElement("div");
  heading.className = "card-heading";
  const name = document.createElement("h2");
  name.className = "pokemon-name";
  name.textContent = pokemon.name;
  heading.append(name);

  const types = document.createElement("div");
  types.className = "type-list";
  for (const type of pokemon.types) {
    const pill = document.createElement("span");
    pill.className = "type-pill";
    pill.textContent = type;
    types.append(pill);
  }

  const stats = document.createElement("dl");
  stats.className = "stats";
  for (const [label, value] of [
    ["EXP", pokemon.baseExperience],
    ["Height", `${pokemon.heightMeters} m`],
    ["Weight", `${pokemon.weightKg} kg`],
  ]) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    wrapper.append(term, description);
    stats.append(wrapper);
  }

  const abilities = document.createElement("p");
  abilities.className = "abilities";
  abilities.textContent = `Abilities: ${pokemon.abilities.join(", ") || "Unknown"}`;

  const cryButton = document.createElement("button");
  cryButton.className = "cry-button";
  cryButton.type = "button";
  cryButton.textContent = pokemon.cry ? "Play cry" : "Cry unavailable";
  cryButton.disabled = !pokemon.cry;
  cryButton.addEventListener("click", async () => {
    cryButton.textContent = "Playing…";
    try {
      await new Audio(pokemon.cry).play();
    } catch {
      cryButton.textContent = "Audio was blocked — try again";
      return;
    }
    cryButton.textContent = "Play cry";
  });

  content.append(heading, types, stats, abilities, cryButton);
  card.append(visual, content);
  return card;
}

function currentResults() {
  return filterAndSortPokemon(state.pokemon, {
    query: elements.search.value,
    type: elements.type.value,
    sort: elements.sort.value,
  });
}

function render() {
  const results = currentResults();
  const visible = results.slice(0, state.visibleCount);
  elements.container.replaceChildren(...visible.map(createPokemonCard));
  elements.resultsCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;
  elements.loadMore.hidden = visible.length >= results.length;

  if (results.length === 0) {
    const empty = document.createElement("div");
    empty.className = "state-panel";
    const message = document.createElement("div");
    const title = document.createElement("strong");
    const help = document.createElement("p");
    title.textContent = "No Pokémon matched.";
    help.textContent = "Try another name or clear the filters.";
    message.append(title, help);
    empty.append(message);
    elements.container.append(empty);
  }
}

function populateTypes() {
  const types = [...new Set(state.pokemon.flatMap((pokemon) => pokemon.types))].sort();
  elements.type.replaceChildren(new Option("All types", "all"));
  for (const type of types) {
    elements.type.append(new Option(type.charAt(0).toUpperCase() + type.slice(1), type));
  }
}

async function loadPokemon() {
  elements.loading.hidden = false;
  elements.error.hidden = true;
  elements.container.replaceChildren();

  try {
    const index = await fetchJson(API_URL);
    const details = await Promise.all(index.results.map(({ url }) => fetchJson(url)));
    state.pokemon = details.map(normalizePokemon);
    state.visibleCount = PAGE_SIZE;
    elements.loadedCount.textContent = state.pokemon.length;
    populateTypes();
    render();
  } catch (error) {
    console.error(error);
    elements.error.hidden = false;
    elements.resultsCount.textContent = "Pokédex unavailable";
  } finally {
    elements.loading.hidden = true;
  }
}

for (const control of [elements.search, elements.type, elements.sort]) {
  control.addEventListener("input", () => {
    state.visibleCount = PAGE_SIZE;
    render();
  });
}

elements.clearFilters.addEventListener("click", () => {
  elements.search.value = "";
  elements.type.value = "all";
  elements.sort.value = "id";
  state.visibleCount = PAGE_SIZE;
  render();
  elements.search.focus();
});

elements.loadMore.addEventListener("click", () => {
  state.visibleCount += PAGE_SIZE;
  render();
});

elements.retry.addEventListener("click", loadPokemon);

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  elements.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
});

loadPokemon();
