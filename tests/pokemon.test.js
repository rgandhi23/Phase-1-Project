import test from "node:test";
import assert from "node:assert/strict";

import { filterAndSortPokemon, formatName, normalizePokemon } from "../pokemon.js";

const bulbasaur = normalizePokemon({
  id: 1,
  name: "bulbasaur",
  base_experience: 64,
  height: 7,
  weight: 69,
  abilities: [{ ability: { name: "overgrow" } }, { ability: { name: "chlorophyll" } }],
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  sprites: { other: { "official-artwork": { front_default: "bulbasaur.png" } } },
  cries: { latest: "bulbasaur.ogg" },
});

const charmander = normalizePokemon({
  id: 4,
  name: "charmander",
  base_experience: 62,
  height: 6,
  weight: 85,
  abilities: [{ ability: { name: "blaze" } }],
  types: [{ type: { name: "fire" } }],
  sprites: { front_default: "charmander.png" },
  cries: {},
});

test("formats API names for display", () => {
  assert.equal(formatName("mr-mime"), "Mr Mime");
});

test("normalizes optional API data safely", () => {
  assert.equal(charmander.name, "Charmander");
  assert.deepEqual(charmander.abilities, ["Blaze"]);
  assert.equal(charmander.cry, "");
  assert.equal(charmander.heightMeters, 0.6);
});

test("filters by name or type", () => {
  assert.deepEqual(filterAndSortPokemon([bulbasaur, charmander], { query: "grass" }), [bulbasaur]);
  assert.deepEqual(filterAndSortPokemon([bulbasaur, charmander], { type: "fire" }), [charmander]);
});

test("sorts without mutating the source list", () => {
  const source = [charmander, bulbasaur];
  const sorted = filterAndSortPokemon(source, { sort: "experience" });
  assert.deepEqual(sorted.map(({ id }) => id), [1, 4]);
  assert.deepEqual(source.map(({ id }) => id), [4, 1]);
});
