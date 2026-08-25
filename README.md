# JooBlog

A full-stack blogging platform, built as a **DevOps learning project**. The app itself (write posts, comment, upload media, admin panel) is just the vehicle — the real point of this repo is practicing how to containerize, deploy, and provision a real application end-to-end:

- Writing multi-stage **Dockerfiles** for a Node API and a React SPA
- Wiring services together with **docker-compose** and an **nginx** reverse proxy
- Provisioning real AWS infrastructure with **Terraform**, split into reusable modules and per-environment stacks (dev / staging / prod)
- Practicing 12-factor config (env vars, secrets, `.env` files) instead of hardcoding values

## Architecture

```
                     ┌──────────────────────┐
                     │        Browser       │
                     └──────────┬───────────┘
                                │ :80 / :443
                     ┌──────────▼────────────┐
                     │   frontend (nginx)    │  React SPA (static build)
                     │   proxies /api → ─────┼────┐
                     └───────────────────────┘    │
                                                  │ :5000
                     ┌────────────────────────┐   │
                     │  backend (Node/Express)│◄──┘
                     │   REST API + JWT auth  │
                     └──────────┬─────────────┘
                                │ :27017
                     ┌──────────▼─────────────┐
                     │        MongoDB         │
                     └────────────────────────┘

              Media/uploads → AWS S3 (via backend)
```

Locally, all of this is run with `docker-compose`. In AWS, the same shape is
provisioned with Terraform: the frontend build goes to S3 + CloudFront, the
backend runs on EC2/compute behind an ALB, and MongoDB is replaced by
DocumentDB — see `terraform/README.md`.

## Repo layout

```
.
├── backend/     # Node.js + TypeScript + Express + MongoDB API
├── frontend/    # React + TypeScript + Vite SPA
├── docker/      # Dockerfiles, nginx config, docker-compose for local dev
└── terraform/   # AWS infrastructure as code (modules + per-env stacks)
```

Each folder has its own README with more detail:

- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)
- [`docker/README.md`](./docker/README.md)
- [`terraform/README.md`](./terraform/README.md)

## Running it locally

```bash
cd docker
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

Copy `backend/.env.example` to `backend/.env` (if present) and fill in real
secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, AWS credentials for S3
uploads) before running in anything beyond a throwaway local setup — the
compose file ships with obviously-fake defaults.

## Deploying to AWS

Infrastructure lives entirely in `terraform/`. See that folder's README for
the module breakdown and how to stand up `dev`, `staging`, or `prod`.