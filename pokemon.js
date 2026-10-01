const TYPE_COLORS = {
  bug: "#64772f",
  dark: "#383b4b",
  dragon: "#4f5fbd",
  electric: "#8b6b12",
  fairy: "#9c477b",
  fighting: "#92412d",
  fire: "#a8432c",
  flying: "#496c95",
  ghost: "#565083",
  grass: "#39754a",
  ground: "#8a6034",
  ice: "#367f8a",
  normal: "#666d79",
  poison: "#72418f",
  psychic: "#9b3f68",
  rock: "#776a3d",
  steel: "#4f6b75",
  water: "#356da4",
};

export function formatName(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizePokemon(pokemon) {
  const types = (pokemon.types ?? []).map(({ type }) => type.name);
  const abilities = (pokemon.abilities ?? []).map(({ ability }) => formatName(ability.name));

  return {
    id: pokemon.id,
    rawName: pokemon.name,
    name: formatName(pokemon.name),
    image:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ??
      pokemon.sprites?.front_default ??
      "",
    types,
    abilities,
    baseExperience: pokemon.base_experience ?? 0,
    heightMeters: (pokemon.height ?? 0) / 10,
    weightKg: (pokemon.weight ?? 0) / 10,
    cry: pokemon.cries?.latest ?? pokemon.cries?.legacy ?? "",
    color: TYPE_COLORS[types[0]] ?? "#365679",
  };
}

export function filterAndSortPokemon(pokemon, { query = "", type = "all", sort = "id" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = pokemon.filter((entry) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      entry.name.toLowerCase().includes(normalizedQuery) ||
      entry.types.some((entryType) => entryType.includes(normalizedQuery));
    const matchesType = type === "all" || entry.types.includes(type);
    return matchesQuery && matchesType;
  });

  return [...filtered].sort((left, right) => {
    if (sort === "name") return left.name.localeCompare(right.name);
    if (sort === "experience") return right.baseExperience - left.baseExperience;
    return left.id - right.id;
  });
}
