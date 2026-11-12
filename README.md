# CAVXX

Vue 3 + Vite video browsing frontend. The UI follows the page layout and visual style of [fuliwz/yy1080](https://github.com/fuliwz/yy1080).

## Direct browser API (no Pages Functions)

All video requests use the native browser Fetch API and go directly to the AppleCMS legacy Provide API. The default endpoint is `https://api.heiapi.cc/api.php/provide/vod/`; it can be overridden at build time with `VITE_APPLECMS_API_BASE`.

This repository intentionally has no `functions/` directory, Pages Functions, server-side proxy, or Vite API proxy.

1. Optional: copy `.env.example` to `.env.local` and set `VITE_APPLECMS_API_BASE` to your complete Provide endpoint.
2. The API host must allow CORS requests from the deployed site origin. Browser code cannot bypass CORS.
3. Run `npm install`, then `npm run dev` or `npm run build`.

Cloudflare Pages settings: build command `npm run build`, output directory `dist`. No API environment variable is required when using the default endpoint. If you override it, set `VITE_APPLECMS_API_BASE` as a build environment variable and trigger a new deployment because Vite embeds environment values during the build. Pages only serves static files.

## API fields

Uses `ac=list`, `ac=detail`, `pg`, `pagesize`, `t`, `wd`, and `ids`. Expected response fields include `list`, `class`, and `pagecount`.
