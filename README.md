# Shongkolpo — Client

Next.js front end for **Shongkolpo**, a community social-service events app. Organisers post volunteer events (clothing drives, cleanups, plantations, health camps) and volunteers join them in a tap.

> **Live site:** _add your Vercel URL here once deployed_
> **API repo:** [B14-A8_Cat-Hermione-Munna-server](https://github.com/Mrehmanx64/B14-A8_Cat-Hermione-Munna-server)

## Features

- **Public event discovery** — hero landing page, upcoming events with search, type filter and sort; full event detail pages with organiser rail.
- **Auth** — email/password plus Google and GitHub sign-in via [BetterAuth](https://www.better-auth.com/). Sessions are Mongo-backed; short-lived JWTs (15 min) are minted client-side and attached to every API call, with automatic re-mint on `401`.
- **Organiser dashboard** — create, edit and delete your own events (two-step delete confirm).
- **Volunteer dashboard** — the events you have joined, tracked against your profile.
- **Profile editor** — display name, photo URL and password.
- **Dark / light theme** — daisyUI `shongkolpo` / `shongkolpo-dark`, persisted in `localStorage` and applied pre-paint by an inline script (no flash).
- **Calendar-day date model** — event dates are stored at noon UTC and formatted/validated consistently from UTC−11 to UTC+11.

## Tech stack

| | |
|---|---|
| Framework | Next.js **16.4.4** (App Router, Turbopack, `cacheComponents`, partial prerendering) |
| UI | React 19, Tailwind CSS 4, daisyUI 5 |
| Auth | BetterAuth 1.7 with the JWT plugin, MongoDB adapter |
| HTTP | axios with a token-minting request interceptor |

> ⚠️ Next 16 differs from earlier releases. `client/AGENTS.md` asks anyone (human or agent) writing App Router code to read the relevant guide in `node_modules/next/dist/docs/` first. Note `await params` stays inside a `<Suspense>` boundary so the App Shell remains URL-independent.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev                    # http://localhost:3000
```

The API must be running separately — see the [server repo](https://github.com/Mrehmanx64/B14-A8_Cat-Hermione-Munna-server). Point `NEXT_PUBLIC_API_URL` at it.

### Environment variables

See [`.env.example`](.env.example) for the annotated list. The important ones:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API |
| `MONGODB_URI` | Atlas connection string (BetterAuth users and sessions) |
| `MONGODB_DB_NAME` | Database name, shared with the API (default `shongkolpo`) |
| `BETTER_AUTH_URL` | Public URL of this app; used as JWT issuer and audience |
| `BETTER_AUTH_SECRET` | Signing secret for sessions |
| `GOOGLE_*` / `GITHUB_*` | Optional OAuth clients — leave blank to hide those buttons |

`.env.local` is git-ignored. Never commit real credentials.

## Deploying to Vercel

1. Push this repo, then **Add New → Project** in Vercel and import it.
2. Framework preset is detected as Next.js; no build settings needed.
3. Add every variable from `.env.example` under **Settings → Environment Variables**, with production values:
   - `NEXT_PUBLIC_API_URL` → your deployed server URL
   - `BETTER_AUTH_URL` → `https://<your-app>.vercel.app`
   - `MONGODB_URI`, `MONGODB_DB_NAME`, `BETTER_AUTH_SECRET`, OAuth pairs
4. Deploy. Then **update the server** (`BETTER_AUTH_URL`, `BETTER_AUTH_JWKS_URL`, `CLIENT_URL`) to the Vercel URL and redeploy it — the two must agree or JWT verification and CORS will fail.
5. Add `https://<your-app>.vercel.app/api/auth/callback/google` and `.../callback/github` to the OAuth providers' authorised redirect URIs.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
  app/
    (auth)/          login, register — split-panel layout
    api/auth/        BetterAuth route handler
    dashboard/       manage / joined event lists (protected)
    events/          browse, create, [id] detail, [id]/edit
    profile/         profile editor (protected)
  components/        events, layout, providers, ui
  lib/               api client, auth, event helpers, validation
```

## License

Built as an academic assignment (B14 — A8).
