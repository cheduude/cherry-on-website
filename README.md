# Cherry on Website

React, TypeScript, and Vite frontend for `main.cherryon.art`.

## Server setup

Use a Node.js version compatible with the locked dependencies, then install them:

```sh
npm ci
cp .env.example .env
```

Set `VITE_API_URL` in `.env` to the API origin. The current API is `https://aut.cherryon.art`; the frontend API client adds the `/api` prefix itself. This variable is read when Vite starts or builds the app, so configure it before either command.

## Run Vite on the server

```sh
npm run dev
```

Vite listens on `0.0.0.0:13001`, and the intended direct URL is:

```text
http://main.cherryon.art:13001
```

For direct access, point the domain's DNS record to the server and allow inbound TCP port `13001` in the server firewall and hosting firewall. This Vite server speaks HTTP, not HTTPS. For HTTPS, put a TLS reverse proxy in front of Vite and proxy WebSocket upgrades for HMR.

## Production build

```sh
npm run build
```

The output is in `dist/`. Serve that directory with a production web server such as Nginx and configure SPA fallback to `index.html` for routes such as `/auth` and `/cabinet/profile`. The Vite `server` settings above apply only to `npm run dev`; they do not configure the production web server.

The browser calls the API at `VITE_API_URL`. The API must allow the production website origin through CORS; refresh-token requests use credentials, so the API must also allow credentials for that exact origin.
