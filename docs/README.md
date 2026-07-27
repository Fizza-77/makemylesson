# Make My Lesson — Next.js Web (documentation index)

This folder contains migration analysis for replacing **Flutter Web** with **Next.js** while keeping **Flutter mobile** and the **shared Firebase backend** unchanged.

**Domains:** product app → [`makemylesson.app`](https://makemylesson.app) on **Hostinger VPS** (nginx + PM2); marketing → [`makemylesson.ai`](https://makemylesson.ai). See [firebase-structure.md](./firebase-structure.md#production-hosting--hostinger-vps-decided).

## Documents

| Document | Description |
|----------|-------------|
| [app-architecture.md](./app-architecture.md) | System design, state, navigation, deployment |
| [database-schema.md](./database-schema.md) | Firestore collections, fields, Storage paths |
| [user-flows.md](./user-flows.md) | Auth, billing, stages, library, notifications |
| [screen-mapping.md](./screen-mapping.md) | Flutter routes → Next.js pages |
| [components-mapping.md](./components-mapping.md) | Widget → React component map |
| [api-mapping.md](./api-mapping.md) | Cloud Functions & client services |
| [firebase-structure.md](./firebase-structure.md) | Project IDs, hosting, env setup |
| [TODO.md](./TODO.md) | Phased implementation backlog |

## Repo progress

See [`../../docs/progress.md`](../../docs/progress.md) for Completed / In Progress / Remaining.

## Source app

Flutter project: `MakeMyLesson/` (`make_my_lesson`).

**Do not implement application code until analysis sign-off** — analysis phase for this migration is complete; implementation follows `TODO.md`.
