# CAVXX

Vue 3 + Vite video browsing frontend. The UI follows the page layout and visual style of [fuliwz/yy1080](https://github.com/fuliwz/yy1080).

## Direct browser API (no Pages Functions)

All video requests use the native browser Fetch API and go directly to the AppleCMS legacy Provide API configured by `VITE_APPLECMS_API_BASE`. This repository intentionally has no `functions/` directory, Pages Functions, server-side proxy, or Vite API proxy.

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_APPLECMS_API_BASE` to the complete Provide endpoint, for example `https://cms.example.com/api.php/provide/vod/`.
3. The API host must allow CORS requests from the deployed site origin. Browser code cannot bypass CORS.
4. Run `npm install`, then `npm run dev` or `npm run build`.

Cloudflare Pages settings: build command `npm run build`, output directory `dist`; set `VITE_APPLECMS_API_BASE` as a build environment variable. Pages only serves static files.

## API fields
Uses `ac=list`, `ac=detail`, `pg`, `limit`, `t`, `wd`, and `ids`. Expected response fields include `list`, `class`, and `pagecount`.
