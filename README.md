# [HAGOVusqueda.com](https://hagovusqueda.com/)

## Local development

For local development, install dependencies via `npm install` and run `npm run dev` to start the local development server

## Data update

The data pipeline requires

- A Google API key with access to Youtube. Copy `.env.example` into `.env` and fill the key
- The `yt-dlp` command installed in your system and available in your $PATH

The two available commands are:

- `npm run download-list` for downloading the list of available Youtube videos from the API. New videos will be added to `data/videos/pending.json` to be later manually sorted into `data/videos/ignored.json` or `data/videos/list.json`.
- `npm run data` to download the selected subtitles from the list in `data/videos/list.json`
