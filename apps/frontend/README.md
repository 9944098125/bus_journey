# Frontend (User App)

React client for Bus Journey passengers. Shares the monorepo backend in `apps/backend`.

## Prerequisites

- Node.js 18+
- [Yarn](https://yarnpkg.com/) (Classic v1)
- MongoDB and backend running (see `apps/backend`)

## Environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://127.0.0.1:5001/api` | Same API base as `apps/backend` (port `5001`) |

## Install & run

```bash
cd apps/frontend
yarn install
yarn dev
```

- App: [http://localhost:3000](http://localhost:3000)
- API: `apps/backend` at `http://127.0.0.1:5001/api`

## Other scripts

```bash
yarn build    # production build
yarn test     # unit tests
yarn start    # serve build on port 3000
```

## Related apps

- **Backend:** `apps/backend`
- **Admin panel:** `apps/admin_panel` (port `3001`, same API URL)
