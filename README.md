# CAVXX

Vue 3 + Vite video browsing frontend. The UI follows the page layout and visual style of [fuliwz/yy1080](https://github.com/fuliwz/yy1080).

## PHP API proxy

The browser calls the PHP proxy at `https://api.7e5zbdgbh4rebo1.sbs/api.php`. The PHP endpoint forwards the allowed AppleCMS parameters to the upstream Provide API at `https://api.heiapi.cc/api.php/provide/vod/`, so the browser no longer calls the upstream API directly.

### PHP deployment

1. Upload the repository's `api.php` file to the document root of the PHP website for `api.7e5zbdgbh4rebo1.sbs`.
2. Enable PHP cURL in the hosting panel.
3. Install and enable a valid HTTPS certificate for `api.7e5zbdgbh4rebo1.sbs`. Cloudflare Pages is HTTPS; browsers block calls from an HTTPS page to an HTTP API (mixed content).
4. Test `https://api.7e5zbdgbh4rebo1.sbs/api.php?ac=list&pg=1&pagesize=5`. It should return JSON.
5. The PHP endpoint allows CORS from `https://cavxx.pages.dev` and caches successful upstream JSON responses for 30 seconds in the system temporary directory.

### Frontend deployment

Cloudflare Pages build command: `npm run build`; output directory: `dist`. The default API URL is already set in `src/api/cms.js`. If overriding it, set `VITE_APPLECMS_API_BASE` to the complete HTTPS PHP endpoint and trigger a new deployment.

## API fields

The proxy forwards `ac`, `pg`, `pagesize`, `t`, `wd`, `ids`, and `sort`. Supported `ac` values are `list` and `detail`.
