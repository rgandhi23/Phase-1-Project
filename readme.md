# Pokémon Index

A browser-based Pokémon explorer created for the Flatiron School Phase 1 project. It loads Pokémon from the public PokéAPI, renders cards in batches, shows abilities and statistics, and plays each Pokémon's cry.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000` in a browser. An internet connection is required for PokéAPI data, images, and audio.

## Automated checks

GitHub Actions checks the JavaScript syntax, verifies the HTML elements required by the application, and confirms the static site can be served after every push and pull request.
