---
target: habits page user flow
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\JAD\\Coding Files\\habit-heatmap\\src\\app\\habits\\page.tsx"
target_fingerprint: "sha256:f34acfaac77c0d35cc5b68a4d4c214c2c27e593fbbdc5164719b38adf2fc56e3"
target_path: "C:\\Users\\JAD\\Coding Files\\habit-heatmap\\src\\app\\habits\\page.tsx"
timestamp: 2026-10-01T00-50-52Z
slug: src-app-habits-page-tsx
---
# Habits dashboard critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2 | Pending labels exist, but successful logging is not strongly tied to today's heatmap cell. |
| 2 | Match System / Real World | 3 | Language is mostly natural; “Yes / No” is less direct than “Done / not done.” |
| 3 | User Control and Freedom | 2 | Close and back paths exist, but dialogs lack complete Escape and focus behavior; destructive actions have no undo. |
| 4 | Consistency and Standards | 2 | Logging is exposed both inline and inside the pencil menu, with different wording. |
| 5 | Error Prevention | 3 | Input constraints and delete confirmation help, but destructive recovery is absent. |
| 6 | Recognition Rather Than Recall | 3 | Primary controls are visible, but mobile hides the add label and heatmap detail depends on color and hover. |
| 7 | Flexibility and Efficiency | 2 | Inline logging is efficient, but there is no accelerated keyboard path and the duplicate route adds friction. |
| 8 | Aesthetic and Minimalist Design | 3 | The restrained ledger is coherent, but repeated counts, actions, and borders dilute the heatmap. |
| 9 | Error Recovery | 2 | Inline errors exist, but field associations and recovery guidance are incomplete. |
| 10 | Help and Documentation | 1 | The interface does not explain heatmap intensity, mobile horizontal scrolling, or measurable semantics. |
| **Total** | | **23/40** | **Acceptable — a solid base with significant flow improvements needed** |

## Design Specificity Verdict

The page is moderately product-specific. Putting today's action beside a 365-day record is exactly the right structural idea for MapaBit, and the bronze-on-black heatmap gives the product a recognizable center. The surrounding header, totals strip, menus, and dialogs remain category-adjacent, however, while the strongest product artifact—the heatmap—is visually subordinate to metadata and repeated counts.

The independent deterministic scan returned zero findings across `src/app/habits`. This supports the view that the page avoids common mechanical design anti-patterns; the important issues are semantic, behavioral, and accessibility-related rather than lint-like styling defects. Browser automation was unavailable, so runtime focus, actual contrast, overflow, and touch behavior were not directly exercised.

## Overall Impression

The flow has the right skeleton: identify a habit, log today, see history. The biggest opportunity is to make the log-to-feedback moment unmistakable while removing secondary actions and duplicated information that compete with it.

## What’s Working

- Habit identity, today's control, and annual history are co-located, which minimizes context switching.
- Boolean logging is one tap and becomes unavailable once complete, supporting the under-ten-second promise.
- Mobile confines horizontal scrolling to the heatmap instead of destabilizing the whole page.

## Cognitive Load

Moderate cognitive load: three checklist failures.

- Visual hierarchy: date, totals, repeated entry counts, inline logging, settings, heatmap framing, and legend compete before the annual pattern becomes dominant.
- Progressive disclosure: the habit-creation flow shows unit-related complexity when it is not needed for boolean habits.
- Pattern consistency: logging is available inline and again inside the pencil menu.
- Choice counts stay manageable and the row correctly keeps the information required for a decision together.

## Emotional Journey

The page opens calm and credible, and the inline control makes action approachable. The emotional peak is weak: logging feels like submitting a form rather than visibly changing today's place in a year-long pattern. The empty state lacks a nearby activation action, while a nonfunctional Settings item creates a trust valley. The year view provides closure, but feedback should connect the control and today's cell more clearly.

## Priority Issues

### P1 — Nonfunctional Settings is presented as a real action

Users reasonably expect a labeled menu item to work. Remove it for V1 rather than closing the menu without an outcome. Suggested command: `$impeccable distill src/app/habits/header-actions.tsx`.

### P1 — Dialog accessibility and recovery are incomplete

Create and per-habit dialogs need reliable initial focus, focus containment, Escape dismissal, background inertness, opener focus restoration, and field errors connected with `aria-describedby`. Suggested command: `$impeccable audit src/app/habits`.

### P1 — The heatmap is not understandable without sight or hover

Non-focusable cells and `title` attributes do not provide a dependable keyboard, touch, or screen-reader experience. Add a concise accessible summary for each habit, treat the visual grid as decorative for assistive technology unless day inspection is implemented, and tailor legend language to habit type. Suggested command: `$impeccable audit src/app/habits/page.tsx`.

### P2 — The core logging action is duplicated

Keep logging exclusively inline. Limit the pencil control to edit and delete, and label it “Habit settings” so its purpose is clear. Suggested command: `$impeccable clarify src/app/habits`.

### P2 — Mobile activation and touch efficiency need refinement

Keep primary controls at least 44px, retain a short visible Add label where possible, add “Add your first habit” inside the empty state, and provide a subtle horizontal-scroll cue for the year view. Suggested command: `$impeccable adapt src/app/habits`.

## Persona Red Flags

**Alex — power user:** Duplicate logging creates an unnecessary branch; there is no accelerated focus path to the first unfinished habit, and many annual grids may become slow to scan.

**Sam — accessibility-dependent user:** Dialog focus behavior is incomplete; heatmap detail depends on hover/color; error text is not fully associated with fields; small labels and compact controls need runtime verification.

**Casey — distracted mobile user:** Add is icon-only and high on the page, the empty state has no local CTA, horizontal discovery is unexplained, and interrupted measurable input may be lost.

## Minor Observations

- Global totals, row entry counts, “logged” counts, and the legend repeat related information.
- “Less / More” is ambiguous for boolean habits; “Not logged / Logged” is clearer.
- Verify month-label alignment, text encoding, contrast, and local-versus-UTC day behavior in a real browser.
- The current date competes with the title without directly helping users log.

## Questions to Consider

- What if the first incomplete habit owned the strongest emphasis?
- Could today's cell become the confirmation moment, visibly connecting action and result?
- If secondary actions vanished from the initial viewport, would MapaBit feel faster and more distinctive?
