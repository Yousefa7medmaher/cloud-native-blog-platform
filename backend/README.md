# backend/

The JooBlog REST API — Node.js, TypeScript, Express, and MongoDB (via
Mongoose). Handles auth, posts, comments, categories, media uploads (S3),
and admin functions.

## Stack

- **Runtime:** Node.js 22 (see `docker/backend.Dockerfile`)
- **Language:** TypeScript, compiled to `dist/` for production
- **Framework:** Express
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (access + refresh tokens), via `jsonwebtoken` + `bcrypt`
- **File uploads:** `multer` → AWS S3 (`@aws-sdk`)
- **Validation:** `express-validator`
- **Security/ops middleware:** `helmet`, `cors`, `express-rate-limit`, `morgan`, `compression`

## Folder structure

```
backend/
├── src/
│   ├── config/        # env loading, DB connection, S3 client setup
│   ├── controllers/    # request handlers (one per resource: auth, posts, comments, ...)
│   ├── middleware/     # auth guard, rate limiting, upload handling, error handler, validation
│   ├── models/         # Mongoose schemas (User, Post, Comment, Category, Tag, Media, Like, Notification)
│   ├── routes/         # Express routers, one per resource, combined in routes/index
│   ├── services/       # business logic (auth, posts, comments, notifications, S3)
│   ├── utils/          # small helpers (ApiError, ApiResponse, asyncHandler, jwt, slugify, reading time)
│   └── validators/     # express-validator schemas per resource
├── dist/                # compiled JS output (build artifact, not committed source of truth)
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

### Request flow

```
route → validator (express-validator) → controller → service → model (Mongoose) → MongoDB
                                              │
                                              └─→ S3 (media uploads, via services/s3Service)
```

Errors from anywhere in that chain flow to `middleware/errorHandler`, and
async route handlers are wrapped with `utils/asyncHandler` so thrown errors
don't need manual try/catch in every controller.

## Environment variables

Configured via `.env` (loaded by `config/env`) or injected by
`docker-compose.yml`:

| Variable              | Purpose                                  |
|------------------------|-------------------------------------------|
| `NODE_ENV`             | `development` / `production`               |
| `PORT`                 | API port (default `5000`)                  |
| `MONGODB_URI`          | Mongo connection string                    |
| `JWT_ACCESS_SECRET`    | signs short-lived access tokens            |
| `JWT_REFRESH_SECRET`   | signs longer-lived refresh tokens          |
| `CLIENT_URL`           | frontend origin, used for CORS             |
| `AWS_REGION`           | region for the S3 client                   |
| `AWS_BUCKET_NAME`      | bucket for media uploads                   |

## Scripts

```bash
npm run dev      # run with hot-reload (tsx) against src/
npm run build    # compile TypeScript to dist/
npm start        # run the compiled dist/server.js (production)
npm run lint     # eslint
```

## Running standalone (without docker-compose)

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

Requires a reachable MongoDB instance — either run `mongodb` from
`docker/docker-compose.yml` on its own, or point `MONGODB_URI` at any Mongo
instance.