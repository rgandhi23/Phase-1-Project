# Pokédex Explorer

A responsive browser application for exploring live Pokémon data. The project fetches 60 Pokémon from PokéAPI, preserves Pokédex order, and lets visitors search names and types, filter by type, sort results, compare statistics, and play Pokémon cries.

## Portfolio features

- Live PokéAPI integration with visible loading, empty, and error states
- Search by Pokémon name or type
- Type filtering and three sort modes
- Paginated rendering with a “Load more” interaction
- Official artwork, abilities, measurements, experience, and audio
- Safe handling for missing abilities, artwork, statistics, or cries
- Responsive layout, keyboard-friendly controls, semantic HTML, and reduced-motion support
- Pure JavaScript data utilities covered by automated tests
- GitHub Actions syntax, unit, structure, and static-server checks

## Run locally

No installation or API key is required.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). An internet connection is required for PokéAPI data, artwork, and audio.

## Run the checks

Node.js 20 or newer is recommended.

```bash
npm test
npm run check
```

## Architecture

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic application structure and accessible controls |
| `styles.css` | Responsive visual system and interaction states |
| `pokemon.js` | Pure normalization, formatting, filtering, and sorting logic |
| `script.js` | PokéAPI requests, application state, rendering, and browser events |
| `tests/pokemon.test.js` | Unit tests for reusable data behavior and edge cases |

## Data flow

```text
PokéAPI index → parallel detail requests → normalized Pokémon models
       → search/type/sort pipeline → paginated card rendering
```

This began as a Flatiron School Phase 1 project and was upgraded into a tested, portfolio-ready frontend application.
