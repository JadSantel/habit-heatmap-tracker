# Habit Heatmap

A mobile-friendly habit tracker built around a GitHub-style heatmap. The MVP
goal is to let a signed-in user record a daily habit in under ten seconds and
see recent consistency immediately.

## Current milestone

This repository currently contains only the application foundation. It does
not yet include authentication, database models, habit forms, or heatmaps.

Planned stack:

- Next.js App Router, React, TypeScript, and Tailwind CSS
- Better Auth
- PostgreSQL and Prisma
- Zod validation

## Prerequisites

- Node.js 20.9 or later (Node 24 is recommended by current Prisma guidance)
- npm
- PostgreSQL, once Prisma is initialized in the next setup step

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy the environment template:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Fill `DATABASE_URL` with your local PostgreSQL connection string and set a
   unique `BETTER_AUTH_SECRET`. Never commit `.env`.

4. Start the application:

   ```powershell
   npm run dev
   ```

5. Open http://localhost:3000.

On systems that block the PowerShell `npm.ps1` script, use `npm.cmd` and
`npx.cmd` instead, for example `npm.cmd run dev`.

## Quality checks

Run these before committing changes:

```powershell
npm run lint
npm run typecheck
npm run build
```

`next build` does not run ESLint automatically in Next.js 16, so linting is a
separate required check.

## Environment variables

| Variable | Purpose | Required locally | Safe for browser? |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server-only PostgreSQL connection string. | Yes, once the database is configured. | No |
| `BETTER_AUTH_SECRET` | Signs/protects authentication data. | Yes, once auth is configured. | No |
| `BETTER_AUTH_URL` | Local/deployed application origin used by Better Auth. | Yes, once auth is configured. | No |

Variables without the `NEXT_PUBLIC_` prefix remain server-only in Next.js. No
secret belongs in a `NEXT_PUBLIC_` variable.

## Planned repository structure

```text
src/
  app/          # Route files and page-specific UI
  lib/          # Server-only Prisma/auth helpers and validation
prisma/         # Prisma schema and database migrations
```

We will add folders only when a milestone requires them. This keeps the early
project easy to navigate.

## Database migration policy

Prisma migrations will be committed to Git. Local development uses
`prisma migrate dev`; production will apply the already-committed migrations.
Do not use `prisma db push` as the normal production workflow because it does
not create a reviewable migration history.
