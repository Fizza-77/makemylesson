# Make My Lesson — Web (Next.js)

Single project combining:

- **Marketing site** — `marketing/` + `app/(marketing)/` (public pages on `/`, `/pricing`, `/features`, …)
- **Teacher PWA** — `app/(app)/` + `features/` (auth, stages, library, billing)

Shares Firebase with the Flutter mobile apps. The standalone `../makemylesson` folder is deprecated — edit here only.

## Setup

```bash
cd nextjs
cp .env.example .env.local
# Fill NEXT_PUBLIC_FIREBASE_* from Firebase Console (new Web app in makemylesson-44088)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docs

See [`docs/`](./docs/README.md) for architecture, schema, and migration checklist.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Firebase JS SDK, TanStack Query, Zustand, React Hook Form, Zod, Framer Motion, next-pwa.

Hosting (later): Hostinger VPS — see `docs/firebase-structure.md`.
