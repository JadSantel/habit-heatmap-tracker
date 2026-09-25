# Habit Heatmap

A mobile-friendly habit tracker built around a GitHub-style heatmap. The MVP
goal is to let a signed-in user record a daily habit in under ten seconds and
see recent consistency immediately.

## Current status

The project foundation, auth flow, and the Milestone 3 database schema are in
place. Users can register, log in, and reach a protected `/habits` dashboard,
and the Prisma schema now includes the Better Auth tables plus the application
`Habit` and `HabitEntry` models needed for the habit tracker.

### What is implemented

- **Auth** — email/password and OAuth (Google, GitHub) registration and login via Better Auth with the
  Prisma adapter. Sessions are validated server-side on each protected route.
- **Routes**
  - `/` — public landing page
  - `/login` — login form (`LoginForm` client component)
  - `/register` — registration form (`RegisterForm` client component)
  - `/habits` — protected dashboard; redirects unauthenticated visitors to
    `/login`, displays the signed-in user's name and a sign-out button
  - `/api/auth/[...all]` — Better Auth catch-all API route
- **Prisma** — client v7 configured with the `pg` driver adapter; output
  directed to `src/generated/prisma`. The schema includes Better Auth models,
  `HabitType`, `Habit`, and `HabitEntry` with a unique `(habitId, date)` constraint.
- **Migrations** — the Milestone 3 migration is present under
  `prisma/migrations` and the database is reported as up to date.
- **Stack wired up** — Next.js 16 App Router, React 19, TypeScript 5,
  Tailwind CSS 4, Zod 4, `pg` 8.

### What is not yet implemented

- Habit creation form and server action / API route
- Habit logging and heatmap display
- Edit and delete habit flows
- Validation and authorization hardening beyond the basic auth route checks

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
  schema.prisma     # Prisma schema with Better Auth + habit data models
  migrations/       # Committed migration history
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

5. Apply the committed Prisma migrations to the database:

   ```powershell
   npx prisma migrate dev
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
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID. | Yes | No |
| `GITHUB_CLIENT_SECRET`| GitHub OAuth client secret. | Yes | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. | Yes | No |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret. | Yes | No |

Variables without the `NEXT_PUBLIC_` prefix remain server-only in Next.js. No
secret belongs in a `NEXT_PUBLIC_` variable.

## Database migration policy

Prisma migrations will be committed to Git. Local development uses
`prisma migrate dev`; production will apply the already-committed migrations.
Do not use `prisma db push` as the normal production workflow because it does
not create a reviewable migration history.
