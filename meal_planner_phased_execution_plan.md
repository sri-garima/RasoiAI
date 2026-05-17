# Phased execution plan — AI-powered Indian meal planner

This plan implements the [meal planner PRD](meal_planner_ai_prd_document.md) in **small phases**. Each phase is sized for **one focused work session**. After **every** phase, the product is **runnable**: you can open it in a browser, see real UI and behavior, and decide whether to continue.

**Scope note:** Phases follow the PRD MVP (profile, veg preference, family size, pantry/vegetables, daily and weekly plans, grocery gaps). Authentication is staged so early phases stay simple; “guest mode” means **no login required** with data stored locally until cloud auth is added.

---

## Phase 1 — Project shell you can run

**Goal:** A working app skeleton with the chosen stack (e.g. Next.js + Tailwind per PRD) that starts with one command and shows a branded landing line.

**Done when:**

- Dependencies install cleanly.
- Dev server runs.
- Browser shows a single page with app name and one sentence describing what the product will do.

**Why it’s runnable:** You have a real project and URL, not a document.

---

## Phase 2 — App chrome and navigation

**Goal:** Persistent layout (header, main area, footer optional) and **empty** routes or sections for: Home, Profile, Pantry, Plan (daily), Plan (weekly), Grocery — each reachable without errors.

**Done when:**

- Navigation works (no dead links).
- Each destination renders placeholder copy (“Coming next phase”) so structure is visible.

**Why it’s runnable:** You can click around and feel the product map.

---

## Phase 3 — Profile setup (form + local persistence)

**Goal:** Implement the PRD **user profile** fields: name, city, state/region, veg/non-veg (and related options you commit to for v1, e.g. eggetarian / Jain if included), family size, kids/elderly flags, cooking time, budget, preferred cuisine.

**Done when:**

- User can fill the form, save, refresh the page, and see values restored (e.g. browser storage).
- Basic validation (required fields, sensible ranges) with clear messages.

**Why it’s runnable:** Core personalization inputs exist and survive a reload; no AI yet.

---

## Phase 4 — Pantry and vegetables (list + persistence)

**Goal:** **Vegetable & grocery input**: add/remove items (potato, onion, paneer, etc.), optional simple categories if helpful, same persistence approach as profile.

**Done when:**

- List is usable on mobile-width viewport.
- Data persists across refresh and is clearly separate from profile data but available to later phases.

**Why it’s runnable:** Solves half the MVP input story without generation logic.

---

## Phase 5 — Deterministic “fake” meal plan (no AI)

**Goal:** A **logic-based** daily plan: breakfast, lunch, evening snack, dinner — driven only by profile + pantry (e.g. templates or rules by region and veg mode). Same output for same inputs (good for demos and tests).

**Done when:**

- From Profile + Pantry, user opens Daily Plan and taps **Generate** (or auto on load) and sees four slots filled with plausible Indian meal names (and optional one-line notes).
- No external API keys required.

**Why it’s runnable:** End-to-end flow exists; you can judge UX and tone before paying for AI.

---

## Phase 6 — Daily plan UX polish (still no AI)

**Goal:** Improve **daily** plan screen only: loading state, empty states, regenerate, “last generated” timestamp, readable typography, print-friendly or share-friendly layout if desired.

**Done when:**

- Phase 5 behavior intact, clearly nicer to read and use on phone and desktop.

**Why it’s runnable:** Same demo as Phase 5, but closer to shippable quality for the main screen.

---

## Phase 7 — AI-powered daily meal generation

**Goal:** Replace (or augment) rule-based generation for **daily** plan with one LLM integration (OpenAI or Gemini per PRD), using a structured prompt built from profile + pantry.

**Done when:**

- Server-side or secure client pattern for API key is decided and documented for yourself (env vars).
- Errors/timeouts show friendly UI; success shows the four meals with consistent structure.

**Why it’s runnable:** This is the first “real” AI slice; still one day, lower risk than a full week.

---

## Phase 8 — Weekly plan (seven days) with AI

**Goal:** **Weekly** mode: grid or list for seven days, each with breakfast / lunch / snack / dinner, generated in one or batched calls per your rate limits.

**Done when:**

- User can switch daily vs weekly; weekly uses profile + pantry and shows all seven days.
- Loading and partial failure behavior are acceptable (e.g. retry one day).

**Why it’s runnable:** MVP feature set from PRD §10 is largely complete for generation.

---

## Phase 9 — Smart grocery list from the plan

**Goal:** **Smart grocery recommendation**: derive missing ingredients vs pantry (manual ingredient lists per meal from AI, or post-processed), dedupe, and show a checklist.

**Done when:**

- From a generated plan, Grocery page lists “need to buy” vs “already have” (even if ingredient extraction is MVP-crude).
- User can check items off locally.

**Why it’s runnable:** Closes the loop from plan → shopping, a core PRD promise.

---

## Phase 10 — Guest-first hardening and responsiveness

**Goal:** **Non-functional** PRD items: mobile responsive pass, fast perceived load (skeletons, lazy sections), obvious navigation for “first visit” vs “returning”.

**Done when:**

- No login required; empty states explain what to do first (profile → pantry → plan).
- Lighthouse or manual check: no layout breakage on small screens.

**Why it’s runnable:** Same features, but it feels like a product, not a prototype.

---

## Phase 11 — Authentication (optional for your MVP gate)

**Goal:** **Sign up / login / guest** per PRD §6: guest remains default; authenticated users sync profile/pantry/plans to Supabase or Firebase.

**Done when:**

- Guest path unchanged.
- Signed-in user sees cloud-backed data on a second device or after clearing local data (smoke test).

**Why it’s runnable:** You can open as guest or as a user and see the correct data mode.

---

## Phase 12 — Deploy and share

**Goal:** **Deployment** (e.g. Vercel): production build, environment variables for AI and database, stable URL.

**Done when:**

- Public URL loads; AI and optional DB work in prod.
- Short “how to run locally + how env works” for your own reference (internal doc is fine).

**Why it’s runnable:** Others can open what you see; you can validate repeat usage.

---

## After MVP (explicitly out of this sequence unless you reprioritize)

Track as separate epics when you want them: health modes, festival mode, regional languages, voice/WhatsApp, recipe detail pages, nutrition tracking — all called out as future in the PRD.

---

## How to use this file

- Stop after any phase: you still have a **demoable** app.
- If a phase runs long, split it only on **runnable** boundaries (e.g. “AI daily without grocery” stays Phase 7; grocery stays Phase 9).
- Keep each phase’s “Done when” as your acceptance checklist before moving on.
