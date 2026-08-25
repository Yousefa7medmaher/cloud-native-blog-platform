# frontend/

The JooBlog single-page app — React + TypeScript, built with Vite, served in
production by nginx (see `docker/frontend.Dockerfile` and
`docker/nginx.conf`).

## Stack

- **Framework:** React + TypeScript
- **Build tool:** Vite
- **Validation:** Zod (`zod`, `zod-validation-error`)
- **Production server:** nginx (static build + reverse proxy to the API)

## Folder structure

```
frontend/
├── public/                 # static assets served as-is (favicon, icons)
└── src/
    ├── App.tsx              # root component / router setup
    ├── main.tsx             # app entry point
    ├── index.css            # global styles
    ├── assets/              # images used within components
    ├── components/
    │   ├── auth/             # ProtectedRoute (auth-gated routing)
    │   ├── comments/          # CommentSection
    │   ├── editor/            # RichTextEditor
    │   ├── layout/            # Navbar, Footer
    │   ├── posts/             # PostCard, PostEditor
    │   └── ui/                # generic UI primitives (Button, Card, Input, Avatar, Badge, Spinner, Textarea)
    ├── context/               # AuthContext (global auth state)
    ├── hooks/                 # useDebounce, etc.
    ├── layouts/                # MainLayout (shared page shell)
    ├── pages/                  # one component per route (Home, Login, Register, Post detail/edit/write,
    │                           #   Search, Profile, Author, Dashboard, Admin)
    ├── services/                # API client layer (api.ts + one service per resource: auth, posts,
    │                           #   categories, admin) — talks to the backend over VITE_API_URL
    ├── types/                   # shared TypeScript types
    └── utils/                   # helpers.ts
```

### How data flows

```
page component → services/*Service.ts → services/api.ts (axios/fetch client) → backend REST API
                        │
                        └─→ AuthContext (holds current user / tokens, read by ProtectedRoute)
```

## Environment variables

- `VITE_API_URL` — base URL of the backend API (e.g.
  `http://localhost:5000/api` locally). This is a **build-time** value —
  Vite inlines it into the static bundle, so changing it requires a rebuild
  (see the `ARG VITE_API_URL` in `docker/frontend.Dockerfile`).

## Scripts

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Production serving

The Docker image builds the app with Vite and hands the static `dist/`
output to nginx, which also reverse-proxies `/api/*` requests to the backend
container — see `docker/README.md` for the full nginx routing setup.