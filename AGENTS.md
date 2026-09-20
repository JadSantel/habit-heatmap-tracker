# Habit Heatmap — AI Assistant Instructions

This file is the authoritative instruction set for any AI coding assistant working on this project.
Read it fully before writing any code, suggesting any feature, or making any architectural decision.

---

## What This Project Is

A mobile-friendly habit tracker built around a GitHub-style contribution heatmap.
Users log a daily habit in under ten seconds and see their consistency at a glance.

**Core product loop:** Log habit -> See heatmap update -> Maintain streak -> Repeat daily.

---

## Fixed Technology Stack

Do NOT introduce any technology not listed here unless it solves a clearly identified requirement
that the existing stack cannot reasonably handle. For every additional technology you propose,
you must explain: what problem it solves, why the stack cannot solve it, and whether it is
required for the MVP or can wait.

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Frontend | React (via Next.js) |
| Styling | Tailwind CSS |
| Authentication | Better Auth |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |

**Do not introduce:** Redux, Zustand, Jotai, tRPC, GraphQL, Drizzle, Supabase, Firebase,
Clerk, NextAuth, React Query, SWR, or any other library not listed above unless a concrete
MVP requirement makes the existing stack incapable of solving it.

---

## Current Milestone Status

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Project setup (Next.js, TS, Tailwind, Prisma, env) | Complete |
| 2a | Authentication — email/password, protected routes | Complete |
| 2b | Authentication — Google & GitHub OAuth | Deferred (next) |
| 3 | Core database entities — Habit model, migrations | Not started |
| 4 | Habit creation form and server action | Not started |
| 5 | Heatmap visualisation | Not started |
| 6 | Update / delete habits | Not started |
| 7 | Validation and authorization hardening | Not started |
| 8 | UI polish | Not started |
| 9 | Testing | Not started |
| 10 | Deployment | Not started |

**Do not skip milestones or implement features from a later milestone while an earlier one is incomplete.**

---

## Development Rules

### Rule 1 — Do not code prematurely
Before writing any implementation code, confirm the relevant requirement, user flow, and
acceptance criteria are understood and documented in project.md.

### Rule 2 — Favor simplicity
Prefer the simplest solution that satisfies the requirement. Avoid abstractions that exist
to support hypothetical future requirements.

### Rule 3 — Protect the MVP scope
The following features are explicitly OUT OF SCOPE for V1 and must NOT be built:
- Push or email reminders / notifications
- AI habit analysis or weekly/monthly/yearly summaries
- CSV export or import
- Mobile native app (React Native / Expo)
- Social features (sharing, followers, leaderboards)
- Multiple heatmap views simultaneously
- Gamification (badges, points, streaks beyond visual display)
- Habit categories or tags
- Admin panel

If the user proposes any of the above, respond with: "This is listed as out of scope for V1
in project.md. Should we formally promote it to V2, or keep it deferred?"

### Rule 4 — Teach, don't just generate
When recommending any architectural or implementation decision, explain:
- What it is
- Why it exists
- What problem it solves
- What alternatives exist and why this one was chosen

### Rule 5 — Challenge scope creep
When a new feature is proposed, ask: "Does this help the primary user log a habit and see
their heatmap?" If not, recommend postponing it and compare against project.md.

### Rule 6 — Track decisions
Every significant architectural or product decision must be recorded in the Decision Log
section of project.md.

### Rule 7 — Preserve product intent
The core user outcome is: a signed-in user can log a daily habit in under ten seconds and
see their consistency through a heatmap. Every implementation decision should support this.

---

## Architecture Constraints

- Use Next.js App Router (not Pages Router).
- Prefer Server Components by default. Add "use client" only when interactivity requires it.
- Use Server Actions for form submissions (habit creation, habit logging). Do not create
  a separate REST API layer unless there is a concrete reason.
- Validate all user input with Zod on the server before touching the database.
- Authorization: always verify the authenticated user owns the resource before any
  read/write operation. Use auth.api.getSession({ headers: await headers() }) server-side.
- Never expose DATABASE_URL, BETTER_AUTH_SECRET, or any secret in a NEXT_PUBLIC_ variable.
- Prisma migrations are committed to Git. Use prisma migrate dev locally.
  Do NOT use prisma db push as the production workflow.

---

## Key File Locations

```
src/
  app/
    api/auth/         Better Auth catch-all handler
    habits/           Protected habits dashboard (primary page)
    login/            Login page + LoginForm client component
    register/         Registration page + RegisterForm client component
  lib/
    auth.ts           Server-only Better Auth config (NEVER import in client components)
    auth-client.ts    Client-side Better Auth helper
    prisma.ts         Singleton Prisma client (server-only)
  generated/prisma/   Prisma-generated client — DO NOT edit by hand
prisma/
  schema.prisma       Source of truth for all data models
AGENTS.md             This file
project.md            Product blueprint and decision log
README.md             Setup and operational instructions
```

---

## Before You Write Any Code, Ask Yourself

1. Is this feature in the current milestone?
2. Is it in scope for V1 (see project.md — Out of Scope for V1)?
3. Does it require a technology not in the fixed stack?
4. Have the requirement, user flow, and acceptance criteria been defined in project.md?
5. Am I using the simplest approach that satisfies the requirement?

If any answer is "no" or "unsure," stop and clarify with the user before proceeding.
