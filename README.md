# Habit Heatmap

A mobile-friendly habit tracker built around a GitHub-style heatmap. The MVP
goal is to let a signed-in user record a daily habit in under ten seconds and
see recent consistency immediately.

## Current status

The application foundation and authentication layer are in place. A user can
register, log in, and reach a protected `/habits` dashboard. Habit creation and
the heatmap view have not been built yet.

### What is implemented

- **Auth** — email/password registration and login via Better Auth with the
  Prisma adapter. Sessions are validated server-side on each protected route.
- **Routes**
  - `/` — public landing page
  - `/login` — login form (`LoginForm` client component)
  - `/register` — registration form (`RegisterForm` client component)
  - `/habits` — protected dashboard; redirects unauthenticated visitors to
    `/login`, displays the signed-in user's name and a sign-out button
  - `/api/auth/[...all]` — Better Auth catch-all API route
- **Prisma** — client v7 configured with the `pg` driver adapter; output
  directed to `src/generated/prisma`. No application models have been added to
  the schema yet (Better Auth will generate its own tables).
- **Stack wired up** — Next.js 16 App Router, React 19, TypeScript 5,
  Tailwind CSS 4, Zod 4, `pg` 8.

### What is not yet implemented

- Habit models in the Prisma schema and the first migration
- Habit creation form and server action / API route
- Heatmap visualisation
- Any data at `/habits` beyond a placeholder message

## Planned stack

- Next.js App Router, React, TypeScript, and Tailwind CSS
- Better Auth
- PostgreSQL and Prisma
- Zod validation

## Repository structure

```text
src/
  app/              # Route files and page-specific UI
    api/auth/       # Better Auth catch-all handler
    habits/         # Protected habits dashboard
    login/          # Login page and form component
    register/       # Registration page and form component
  generated/prisma/ # Prisma-generated client (do not edit by hand)
  lib/
    auth.ts         # Server-only Better Auth configuration
    auth-client.ts  # Client-side Better Auth helper
    prisma.ts       # Singleton Prisma client
prisma/
  schema.prisma     # Prisma schema (no app models yet)
```

## Prerequisites

- Node.js 20.9 or later (Node 24 is recommended by current Prisma guidance)
- npm
- A PostgreSQL database (local or a hosted Prisma Postgres instance)

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy the environment template:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Fill in the required environment variables (see table below). Never commit
   `.env`.

4. Generate the Prisma client:

   ```powershell
   npx prisma generate
   ```

5. Push the Better Auth schema to the database:

   ```powershell
   npx prisma migrate dev --name init
   ```

6. Start the development server:

   ```powershell
   npm run dev
   ```

7. Open http://localhost:3000.

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
| `DATABASE_URL` | Server-only PostgreSQL connection string. | Yes | No |
| `BETTER_AUTH_SECRET` | Signs/protects authentication data. | Yes | No |
| `BETTER_AUTH_URL` | Local/deployed application origin used by Better Auth. | Yes | No |

Variables without the `NEXT_PUBLIC_` prefix remain server-only in Next.js. No
secret belongs in a `NEXT_PUBLIC_` variable.

## Database migration policy

Prisma migrations will be committed to Git. Local development uses
`prisma migrate dev`; production will apply the already-committed migrations.
Do not use `prisma db push` as the normal production workflow because it does
not create a reviewable migration history.
