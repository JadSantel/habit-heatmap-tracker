# Habit Heatmap — Product Blueprint

This is the living product document for the Habit Heatmap project.
All major decisions, requirements, and scope definitions live here.
Before adding any feature, compare it against this document first.

---

## Product Statement

Habit Heatmap is a web application that lets users log daily habits and visualise their
consistency through a GitHub-style contribution heatmap. The goal is to make progress
visible at a glance and keep the friction of logging as low as possible.

---

## Target User

A student or young professional who wants to build consistent daily habits but struggles
to maintain a tracking system because most tools are too complex, too slow, or not
accessible when the habit is actually performed.

---

## Problem

Most habit trackers require too much friction to log an entry (navigating menus, selecting
dates, writing notes). When logging takes more than 10 seconds, the behavior of tracking
itself breaks down. Users also lack an immediate visual signal of their consistency, which
removes the motivating feedback loop that keeps streaks alive.

---

## Solution

A minimal web app where:
- A user can log a habit with one or two taps/clicks.
- A heatmap (green/grey squares over weeks) shows consistency immediately.
- The heatmap acts as the primary motivator — seeing a gap is the cue to log today.

---

## Core User Outcome

A signed-in user can log a daily habit in under ten seconds and immediately see their
consistency reflected in a heatmap without navigating away from the habit dashboard.

---

## Core Product Loop

Create habit -> Log today -> See heatmap update -> Notice gaps -> Log again tomorrow -> Repeat

---

## MVP Features

### MUST HAVE
These are required for the product to be useful at all.

| Feature | Why it is required |
|---------|-------------------|
| Email/password registration and login | Users need an account to own their data |
| Protected habits dashboard | The primary screen; no app without it |
| Create a habit (name + type) | No heatmap to display without habits |
| Two habit types: boolean (yes/no) and measurable (numeric) | Covers the two real-world patterns identified in the product idea |
| Log a habit entry for today | Core action — without this the heatmap never fills |
| Heatmap visualisation per habit | The entire point of the product |
| Session-based authentication (server-side) | Security baseline |
| Zod validation on all inputs | Data integrity baseline |
| Ownership check on every resource | A user must never see or modify another user's habits |

### SHOULD HAVE
Useful, but the product can launch without them.

| Feature | Why it is deferred |
|---------|-------------------|
| Google & GitHub OAuth (Milestone 2b) | Reduces registration friction but email/password works for early users |
| Edit habit name | Nice to have; not blocking the core loop |
| Delete habit | Nice to have; not blocking the core loop |
| Log an entry for a past date | Useful for catch-up, but adds UI complexity |
| Responsive / mobile-optimised UI | Important for production; UI polish is Milestone 8 |

### LATER (V2 or beyond)
These features must NOT be built during V1.

| Feature | Reason for deferral |
|---------|---------------------|
| Push or email reminders | Requires a background job runner (e.g. cron, queue); out of scope |
| AI habit analysis / summaries | Requires an LLM API; introduces cost and complexity |
| CSV export / import | No user demand validated yet |
| Mobile native app | Separate project; Web first |
| Social features | No validated demand for V1 audience |
| Gamification (badges, points) | Risk of distracting from the heatmap's simplicity |
| Habit categories or tags | Adds navigation complexity; not needed for <10 habits |
| Admin panel | No admin workflow defined |

---

## User Flows

### Flow 1 — Registration
1. User opens `/` (landing page).
2. User clicks "Create an account".
3. User lands on `/register`.
4. User fills in name, email, and password.
5. Zod validates client-side; error shown inline if invalid.
6. Server Action / Better Auth creates account.
7. User is authenticated and redirected to `/habits`.

### Flow 2 — Login
1. User opens `/` or `/login`.
2. User enters email and password.
3. Zod validates client-side.
4. Better Auth validates credentials server-side.
5. Session is created; user is redirected to `/habits`.

### Flow 2b — OAuth Login (Deferred)
1. User clicks "Continue with Google" or "Continue with GitHub".
2. User is redirected to the provider's OAuth consent screen.
3. On success, Better Auth creates or links the account.
4. User is redirected to `/habits`.

### Flow 3 — Create a Habit
1. User is on `/habits` (authenticated).
2. User clicks "New habit".
3. A modal or inline form asks:
   a. Habit name (text field).
   b. Habit type: "Yes/No" or "Measurable" (toggle/radio).
   c. If measurable: unit label (e.g. "minutes", "pages").
4. User submits.
5. Server Action validates with Zod and writes to the database.
6. New habit card with an empty heatmap appears on `/habits`.

### Flow 4 — Log a Habit Entry
1. User opens `/habits`.
2. User sees their habit card with today's date highlighted.
3. For a yes/no habit: user clicks a single "Done today" button.
4. For a measurable habit: user enters a number and clicks "Log".
5. Server Action validates, writes the entry, and returns.
6. Heatmap cell for today fills with colour immediately.

### Flow 5 — View Heatmap
1. User opens `/habits`.
2. For each habit, the last N weeks are shown as a grid of coloured squares.
3. Colour intensity reflects frequency (boolean: logged = green, else grey; measurable: intensity scales with value).
4. User can see gaps at a glance without any additional navigation.

---

## Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | A user can register with name, email, and password. |
| FR-02 | A user can log in with email and password. |
| FR-03 | An unauthenticated user is redirected to `/login` when accessing any protected route. |
| FR-04 | A user can create a habit with a name and type (boolean or measurable). |
| FR-05 | A measurable habit stores a unit label (e.g. "minutes"). |
| FR-06 | A user can log an entry for today for any of their habits. |
| FR-07 | A boolean habit entry records a date and a done flag (true). |
| FR-08 | A measurable habit entry records a date and a numeric value. |
| FR-09 | The heatmap displays the last 365 days (or a configurable window). |
| FR-10 | A user can only read and write their own habits and entries. |
| FR-11 | Duplicate entries for the same habit on the same day are prevented or overwritten. |

---

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Logging a habit must complete in under 10 seconds of user interaction. |
| NFR-02 | The application must be deployable to a free or student-friendly hosting platform. |
| NFR-03 | Secrets (DATABASE_URL, BETTER_AUTH_SECRET) must never be exposed to the browser. |
| NFR-04 | All form inputs must be validated with Zod before reaching the database. |
| NFR-05 | The application must run correctly on mobile browsers (responsive layout). |
| NFR-06 | Production database must use committed Prisma migrations (not db push). |

---

## Business Rules

| ID | Rule |
|----|------|
| BR-01 | A user can only read, update, or delete resources they own. |
| BR-02 | Only one log entry is allowed per habit per calendar day. Logging again on the same day overwrites or is rejected (upsert). |
| BR-03 | A habit cannot be logged before its creation date. |
| BR-04 | Deleting a habit also deletes all its log entries (cascade). |
| BR-05 | A measurable habit entry value must be a positive number. |

---

## Data Model

### User
Managed by Better Auth. Contains: id, name, email, passwordHash, createdAt.

### Habit
Owned by a User.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key -> User |
| name | String | Display name, max 100 chars |
| type | Enum (BOOLEAN, MEASURABLE) | Determines log UI |
| unit | String? | Required when type = MEASURABLE (e.g. "minutes") |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### HabitEntry
A single log entry for a given habit on a given calendar day.

| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | Primary key |
| habitId | String | Foreign key -> Habit |
| date | DateTime | Stored as UTC midnight; unique per habit |
| value | Float? | Null for BOOLEAN habits; positive number for MEASURABLE |
| createdAt | DateTime | |

**Constraint:** (habitId, date) must be unique — one entry per habit per day.

---

## Architecture

| Concern | Decision |
|---------|----------|
| Routing | Next.js App Router |
| Server vs client | Server Components by default; client only for interactive forms |
| Form submission | Server Actions (no separate REST layer for MVP) |
| Authentication | Better Auth with Prisma adapter; session validated server-side |
| Database access | Prisma client (singleton, server-only) |
| Validation | Zod schemas on the server inside Server Actions |
| Authorization | Session check + userId ownership check in every Server Action |
| Error handling | Try/catch in Server Actions; return typed error objects; never expose stack traces |

---

## Required Pages (MVP)

| Route | Purpose | Auth required |
|-------|---------|---------------|
| `/` | Landing page with CTA to register/login | No |
| `/register` | Email/password registration form | No (redirect to /habits if logged in) |
| `/login` | Email/password login form | No (redirect to /habits if logged in) |
| `/habits` | Habits dashboard — list, create, log, view heatmaps | Yes |

---

## MVP Acceptance Criteria

### Registration
- Given a valid name, email, and password, when the user submits the registration form, a new account is created and the user is redirected to `/habits`.
- Given an already-used email, when the user submits, an inline error message is shown.
- Given a password under 8 characters, Zod rejects it client-side before the request is sent.

### Login
- Given correct credentials, when the user submits the login form, a session is created and the user is redirected to `/habits`.
- Given incorrect credentials, an inline error is shown.
- Given an unauthenticated request to `/habits`, the user is redirected to `/login`.

### Habit Creation
- Given a name and type, when the user submits, a new habit card appears on `/habits` with an empty heatmap.
- Given a MEASURABLE type without a unit, the form cannot be submitted.
- Given a name over 100 characters, Zod rejects it.

### Habit Logging
- Given a BOOLEAN habit, when the user clicks "Done today", a filled cell appears for today's date on the heatmap.
- Given a MEASURABLE habit, when the user enters a positive number and submits, today's cell fills proportionally.
- Given a duplicate log attempt on the same day, the system upserts (updates) rather than creating a duplicate.
- Given a negative or zero value for a MEASURABLE habit, the form shows a validation error.

### Heatmap
- Given a habit with 30 days of log entries, the heatmap shows 30 filled cells in the correct positions.
- Given a habit with no entries, the heatmap renders all cells grey (empty state).

---

## Development Milestones

### Milestone 1 — Project Setup ✅ Complete
Next.js, TypeScript, Tailwind, Prisma v7, Better Auth wired up, env vars documented.

### Milestone 2a — Authentication (Email/Password) ✅ Complete
Registration, login, logout, protected route, session validation.

### Milestone 2b — Authentication (OAuth) ✅ Complete
**Objective:** Add Google and GitHub sign-in as alternatives to email/password.
**Features:** Better Auth social providers (Google, GitHub OAuth).
**Files affected:** `src/lib/auth.ts`, login/register pages, env vars.
**Understand before implementing:** How Better Auth social providers work; how to configure OAuth apps in Google Cloud Console and GitHub Developer Settings.
**Definition of done:** User can sign in with Google or GitHub and land on `/habits`.

### Milestone 3 — Habit Data Model 🔲 Next
**Objective:** Define the Habit and HabitEntry models and create the first migration.
**Files affected:** `prisma/schema.prisma`, Server Actions, migration files.
**Definition of done:** `prisma migrate dev` succeeds; Habit and HabitEntry tables exist in the database.

### Milestone 4 — Habit Creation
**Objective:** User can create a named habit with a type.
**Files affected:** `src/app/habits/`, new Server Action, Zod schema.
**Definition of done:** Submitting the creation form creates a Habit row and it appears on the dashboard.

### Milestone 5 — Habit Logging and Heatmap Display
**Objective:** User can log today's entry and see the heatmap.
**Files affected:** Habits dashboard, new Server Action, heatmap component.
**Definition of done:** Logging an entry fills today's heatmap cell.

### Milestone 6 — Edit and Delete Habits
**Objective:** User can rename or delete a habit.
**Definition of done:** Deleting a habit removes it and all its entries (cascade).

### Milestone 7 — Validation and Authorization Hardening
**Objective:** Every Server Action validates input with Zod and checks ownership.
**Definition of done:** No action can be performed on another user's data.

### Milestone 8 — UI Polish
**Objective:** Responsive layout, loading states, empty states, error states.

### Milestone 9 — Testing
**Objective:** Manual test checklist passed; basic smoke tests written.

### Milestone 10 — Deployment
**Objective:** App running on a public URL with production env vars and migrations applied.

---

## Out of Scope for V1

When these are proposed, evaluate as: Required for MVP? | Useful but can wait | Scope creep.

- Push or email reminders
- AI habit analysis (weekly / monthly / yearly summaries)
- CSV export / import
- Mobile native app
- Social features (sharing, followers, leaderboards)
- Gamification (badges, points, streak counters beyond heatmap)
- Habit categories or tags
- Admin panel
- Offline mode / PWA

---

## Decision Log

| # | Decision | Reason | Alternatives Considered | Consequences |
|---|----------|--------|------------------------|--------------|
| 1 | Use Next.js App Router | Modern standard; co-locates server and client code; supports Server Actions natively | Pages Router (legacy), separate Express API | Must use Server Components and Server Actions; no `getServerSideProps` |
| 2 | Use Better Auth | Designed for Next.js App Router; supports Prisma adapter; supports email/password and OAuth in one library | NextAuth v5, Clerk, Supabase Auth | Requires BETTER_AUTH_SECRET and BETTER_AUTH_URL env vars |
| 3 | Use Prisma v7 with pg driver adapter | Prisma v7 requires driver adapters; pg is the standard PostgreSQL driver | Prisma v6 (no upgrade path for new projects), Drizzle | Must pass adapter to PrismaClient; CLI still needs DATABASE_URL in schema |
| 4 | Defer OAuth to Milestone 2b | Email/password is sufficient for early users; OAuth adds env var and third-party setup complexity | Implement OAuth in Milestone 2a | OAuth must be added before significant user growth; no schema changes needed to add it later |
| 5 | Use Server Actions for forms | Removes need for a separate API layer; simplest approach for MVP | REST API routes, tRPC | Forms must use progressive enhancement patterns; error handling via returned objects |
| 6 | One log entry per habit per day (upsert) | Simplest model for a daily habit; prevents duplicate data | Allow multiple entries per day and aggregate | Business Rule BR-02; requires unique constraint on (habitId, date) |
