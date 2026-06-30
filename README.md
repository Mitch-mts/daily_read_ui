# Daily Bible Reader

Full-stack Next.js application for daily Bible reading. Frontend and API live in a single repository — no Java backend required.

## Stack

- **Next.js 15** (App Router + Route Handlers)
- **React 19** + **TypeScript**
- **Tailwind CSS**

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API routes

| Route | Description |
|-------|-------------|
| `GET /api/bible/books` | Bible book metadata |
| `GET /api/bible/book/:bookId/chapter/:chapterId` | Chapter verses |

The frontend calls these relative paths only.

## Project structure

```
src/
├── app/                    # Pages + API route handlers
├── components/             # React UI (client components)
├── services/bible/         # Business logic (BibleService)
├── lib/                    # env, API response helpers
├── types/                  # TypeScript interfaces
├── constants/              # Static book metadata
├── hooks/                  # Client data-fetching hooks
└── utils/                  # Shared errors
```

## Deploy to Netlify

```bash
npm run build
```

Netlify configuration is in `netlify.toml` using `@netlify/plugin-nextjs`.

## Migration notes

See [MIGRATION.md](./MIGRATION.md) for details on the CRA → Next.js refactor and breaking changes.
