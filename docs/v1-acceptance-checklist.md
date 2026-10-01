# V1 Acceptance Checklist

Last run: 2026-10-01

## Automated application checks

Environment: Chromium through Playwright, Next.js development server, isolated Neon PostgreSQL database.

| Area | Check | Result |
|---|---|---|
| Registration | Valid name, email, and password create an account and redirect to `/habits` | Pass |
| Login | Incorrect credentials show an inline alert | Pass |
| Login | Correct credentials create a session and redirect to `/habits` | Pass |
| Route protection | An unauthenticated `/habits` request redirects to `/login` | Pass |
| Authorization | A second user cannot see the first user's habits | Pass |
| Authorization | Replaying an update Server Action as a second user does not mutate the owner's habit | Pass |
| Habit creation | Boolean and measurable habits appear on the dashboard | Pass |
| Habit editing | A habit can be renamed | Pass |
| Habit deletion | A habit and its dependent entries can be deleted | Pass |
| Boolean logging | “Done today” records one entry and disables repeated submission | Pass |
| Measurable logging | Zero is rejected and a positive value is accepted | Pass |
| Same-day logging | A second measurable submission updates the existing entry instead of creating another | Pass |
| Heatmap | Each habit renders exactly 365 dated cells | Pass |
| Heatmap | Today's entry appears in the cell matching today's UTC date | Pass |

Command: `npm.cmd run test:e2e`

Result: **3 passed**.

## Responsive acceptance checks

| Viewport | Check | Result |
|---|---|---|
| Desktop, 1280×900 | Habit names, create control, boolean action, measurable input, and log action remain visible | Pass |
| Desktop, 1280×900 | The document does not overflow horizontally | Pass |
| Mobile, 390×844 | Habit data and daily controls remain visible | Pass |
| Mobile, 390×844 | The document does not overflow horizontally | Pass |
| Mobile, 390×844 | The annual heatmap is the horizontally scrollable region | Pass |
| Mobile, 390×844 | The habit action sheet remains within the viewport | Pass |
| Mobile, 390×844 | Edit and delete remain available | Pass |
| Mobile, 390×844 | Boolean logging remains one action | Pass |
| Mobile, 390×844 | Measurable logging rejects zero | Pass |
| Keyboard | Escape closes the habit action dialog and restores focus to its trigger | Pass |
| Dialogs | Native modal behavior provides focus containment and background inertness | Pass |
| Forms | Validation errors are associated with their inputs through `aria-describedby` | Pass |
| Heatmap | Assistive technology receives a concise 365-day/today summary instead of 365 unlabeled cells | Pass |

Automated file: `tests/e2e/responsive-acceptance.spec.ts`.

## Unit and build checks

| Check | Result |
|---|---|
| Zod validation tests | Pass — 10/10 |
| TypeScript | Pass |
| Focused ESLint for the E2E harness | Pass |
| Next.js production build | Pass |

## Manual or external checks still required

- [ ] Complete a real Google OAuth consent flow and confirm redirect to `/habits`.
- [ ] Complete a real GitHub OAuth consent flow and confirm redirect to `/habits`.
- [ ] Exercise the habits flow on a physical iPhone/Safari device.
- [ ] Exercise the habits flow on a physical Android/Chrome device.
- [x] Complete the P1 accessibility remediation and automated keyboard checks tracked as V1 blocker 3.
- [ ] Confirm the habits flow with VoiceOver or NVDA on a physical environment.
- [ ] Verify the production deployment, environment variables, and migrations tracked as V1 blocker 4.

The emulated desktop and 390px mobile acceptance criteria pass. Physical-device, external-provider, accessibility, and deployed-environment checks remain open and must not be represented as verified.
