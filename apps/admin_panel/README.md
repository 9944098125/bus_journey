# Admin Panel

React admin console for Bus Journey. Same stack and API as `apps/frontend`, with a sea-blue theme and a dedicated layout (header, icon dock, status bar).

Uses **`apps/backend`** — no separate admin API. Point `REACT_APP_API_URL` at the same base URL as the user frontend.

## Prerequisites

- Node.js 18+
- [Yarn](https://yarnpkg.com/) (Classic v1)
- MongoDB and `apps/backend` running

## Environment

Copy the example env file:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Dev server port (frontend uses `3000`) |
| `REACT_APP_API_URL` | `http://127.0.0.1:5001/api` | Same backend as `apps/frontend` |

## Install & run

Use **Yarn only** (same as `apps/frontend`):

```bash
cd apps/admin_panel
yarn install
yarn dev
```

- Admin UI: [http://localhost:3001](http://localhost:3001)
- User app: [http://localhost:3000](http://localhost:3000)
- API: `http://127.0.0.1:5001/api` (`apps/backend`)

### Run full stack (three terminals)

```bash
# Terminal 1 — backend
cd apps/backend && npm run dev

# Terminal 2 — user frontend
cd apps/frontend && yarn dev

# Terminal 3 — admin panel
cd apps/admin_panel && yarn dev
```

Or from the repo root (if Turbo is configured): `pnpm dev`.

## Other scripts

```bash
yarn build    # production build
yarn test     # unit tests
yarn start    # serve build on port 3001
```

## Structure

- `src/app/pages/Login` — admin sign-in
- `src/app/components/layout` — admin header, dock, status bar
- `src/app/slice` — global auth (RTK Query → same login endpoints as frontend)
- `src/store` — Redux store with injectors

## Related apps

- **Backend:** `apps/backend`
- **User frontend:** `apps/frontend`
