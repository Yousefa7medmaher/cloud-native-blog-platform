# docker/

Everything needed to build and run JooBlog locally with Docker. Nothing here
is deployed as-is to AWS — Terraform provisions the real infra — but the same
Dockerfiles are what get built and pushed to a registry for production too.

## Folder structure

```
docker/
├── backend.Dockerfile    # multi-stage build for the Node/Express API
├── frontend.Dockerfile   # multi-stage build for the React SPA, served by nginx
├── nginx.conf            # nginx config used inside the frontend image
└── docker-compose.yml    # wires mongodb + backend + frontend together
```

## backend.Dockerfile

Two stages:

1. **builder** — installs full deps (`npm ci`), copies source, runs
   `npm run build` (TypeScript → `dist/`).
2. **prod** — installs only production deps (`npm ci --omit=dev`), copies the
   compiled `dist/` output from the builder stage, runs as the non-root
   `node` user, and adds a `HEALTHCHECK` that hits `/health` on port 5000.

Result: a small production image that never contains dev dependencies,
TypeScript source, or build tooling.

## frontend.Dockerfile

Two stages:

1. **builder** — installs deps, copies source, injects `VITE_API_URL` as a
   build arg (baked into the static bundle at build time, since Vite env vars
   are compile-time, not runtime), runs `npm run build`.
2. **nginx:alpine** — copies the built static files into
   `/usr/share/nginx/html` and drops in `nginx.conf` as the server config.

Result: a static SPA served by nginx, with no Node runtime in the final
image.

## nginx.conf

Serves the built SPA and reverse-proxies API calls:

- `location /` — serves `index.html` for any unmatched path (SPA routing).
- `location /api` — proxies to `http://backend:5000` (the backend's service
  name on the docker-compose network), forwarding real client IP/host
  headers and supporting websocket upgrades.
- Static assets (`css`, `js`, fonts, images) get long-lived cache headers;
  everything gets basic security headers (`X-Frame-Options`,
  `X-Content-Type-Options`, HSTS, etc.).

## docker-compose.yml

Defines three services on one local network:

| Service    | Image / build             | Port (host:container) | Notes                                  |
|------------|----------------------------|------------------------|-----------------------------------------|
| `mongodb`  | `mongo:7`                  | `27017:27017`           | persists to a named volume `mongodb_data` |
| `backend`  | built from `backend.Dockerfile` | `5000:5000`        | reads `../backend/.env`, connects to `mongodb` |
| `frontend` | built from `frontend.Dockerfile` | `5173:80`          | nginx serving the SPA, proxies `/api` to `backend` |

Key environment variables (see `docker-compose.yml` for full defaults):

- `MONGODB_URI` — points at the `mongodb` service by container name.
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — **override these** in a real
  environment; the compose file only has placeholder defaults.
- `AWS_REGION` / `AWS_BUCKET_NAME` — used by the backend for S3 media uploads.
- `VITE_API_URL` (build arg) — where the frontend expects the API to live.

### Usage

```bash
cd docker
docker compose up --build       # build and start everything
docker compose down             # stop everything
docker compose down -v          # stop and wipe the mongo volume
```