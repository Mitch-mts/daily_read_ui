# Migration: CRA + Java Backend → Next.js Full-Stack

## What changed

This repository was migrated from a Create React App frontend calling an external Java Bible API (`localhost:8068/v1/bible-reader`) to a **single Next.js 15 full-stack application**.

### Architecture

| Before | After |
|--------|-------|
| CRA + React Router | Next.js App Router |
| JavaScript | TypeScript |
| Reactstrap + SCSS template | Tailwind CSS |
| Axios → Java API | `fetch` → `/api/bible/*` Route Handlers |
| Business logic in components | `BibleService` service layer |

### API routes (domain-adapted)

The migration template referenced `guide`, `chat`, and `voice` endpoints. This app is a **Daily Bible Reader**, so routes were implemented for its domain:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/bible/books` | GET | List all 66 Bible books (metadata) |
| `/api/bible/book/[bookId]/chapter/[chapterId]` | GET | Fetch chapter verses |

Route handlers are thin: they validate input, delegate to `BibleService`, and return JSON errors with HTTP status codes.

### Bible text source

Chapter text is fetched **server-side** by `BibleService` from a configurable provider (`BIBLE_API_BASE_URL`, default `https://bible-api.com`). This removes the Java dependency while keeping scripture text out of the client bundle.

To self-host scripture text later, point `DATABASE_URL` at a Postgres/SQLite store and extend `BibleService` to read locally instead of calling the external provider.

### Removed legacy code

- `ApiConstants.js` (Java/Go/AWS URLs)
- `axios` client calls
- Unused `Dropdown.js`, `Utility.js`, Creative Tim demo views
- CRA entry point (`src/index.js`, `react-scripts`)

### Breaking changes

1. **Dev command**: use `npm run dev` instead of `npm start`
2. **Build output**: `.next/` instead of `build/`
3. **API base URL**: relative paths only (`/api/bible/...`)
4. **Response shape**: preserved `{ result: [...] }` for chapter data
5. **Template pages** (Landing, Login, Profile demos) removed — only the Daily Reader remains

### Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Deploy to Netlify

```bash
npm run build
```

Netlify uses `@netlify/plugin-nextjs` (see `netlify.toml`) for a single deployment of frontend + API routes.

### Further improvements

- Persist favorites and reading history via `DATABASE_URL`
- Add AI reflection prompts via `OPENAI_API_KEY` and a future `/api/reflection` route
- Bundle KJV/WEB text locally to remove the external Bible provider dependency
- Add unit tests for `BibleService` and API route handlers
