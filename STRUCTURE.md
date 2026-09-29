# Site structure — AIDA × Hook Model

The site is built on two conversion frameworks working together:

- **AIDA** — the linear persuasion arc a first-time visitor moves through: **A**ttention → **I**nterest → **D**esire → **A**ction.
- **Hook Model** (Nir Eyal) — the loop that brings people *back*: **Trigger → Action → Variable Reward → Investment**.

AIDA drives the **first visit**. The Hook loop turns a visitor into a **returning, invested lead**.

---

## Homepage (`/`) — the full AIDA arc

| Stage | Section | What it does |
|---|---|---|
| **Attention** | Cinematic hero (`CinematicReveal`) | Full-bleed façade→interior reveal, one bold value line, two squared CTAs. Stops the scroll. |
| **Interest** | Stat band (`62 · 16 · 3.8 m · 48 m²`) | Fast, scannable proof of scale and quality. |
| **Interest → Action (micro)** | Interactive **Explorer** | The visitor *does something* (hover, pick a floor, open a plan). This is the first Hook loop on the page. |
| **Desire** | Editorial gallery + Features | Lifestyle imagery + the four reasons to want it. |
| **Desire** | **Scarcity + proof band** (`Only N of 62 remain`) + 3 trust points + resident quote | Loss-aversion + credibility. |
| **Action** | **Final conversion band** (`Reserve your residence`) | One clear ask before the footer: book a viewing / find a home. |
| **Action** | Footer CTA (`Book a private viewing`) | Persistent closing ask + contact. |

---

## Hook Model — implemented site-wide

| Hook phase | Where | Implementation |
|---|---|---|
| **Trigger (external)** | Everywhere | Persistent CTAs; the floating **Shortlist** pill; scarcity lines (`Only N remain`). |
| **Trigger (internal)** | Returning visitors | A saved shortlist creates the "did I lose that apartment?" pull to come back. |
| **Action** | Explorer, catalogue filters, floor plans, **♥ save** | The simplest possible act — one click to reveal or to save. |
| **Variable Reward** | Explorer + catalogue | Every floor/apartment reveals *different* info (price, view, plan, availability). Unpredictable payoff keeps exploration engaging. |
| **Investment** | **Shortlist** (`components/Favorites.tsx`) | Saving residences stores personal effort in `localStorage`. The more you save, the more valuable returning becomes — and the shortlist drawer routes straight to *"Enquire about these residences"* (conversion). |

The **Shortlist** is the backbone of the loop: Trigger (pill) → Action (save) → Variable Reward (a growing personal collection with live prices) → Investment (the saved set) → stronger Trigger next visit.

---

## Apartment page (`/apartment/[id]`) — AIDA in miniature

| Stage | Section |
|---|---|
| **Attention** | Oversized title + animated area number + full-bleed cover. |
| **Interest** | Spec grid + generated intro paragraph. |
| **Interest** | Floor plan (grotesk-labelled). |
| **Desire** | Editorial gallery ("A closer look at your home"). |
| **Desire** | Statement section + **scarcity line** (`Only N residences still available — M on this floor`). |
| **Action** | Price + **Book a viewing** + **♥ Save to shortlist** + **Next residence** (variable-reward continuation). |

## Catalogue (`/apartments`)

- **Action-first** surface: filters (variable reward per selection), **♥ save** on every card, live availability + scarcity line, price sort.

## Admin (`/admin`)

- Operational surface (outside the funnel): manage availability/pricing that *powers* the scarcity and reward signals shown to visitors.

---

## Key components

- `components/Favorites.tsx` — shortlist context, `FavoriteButton` (icon / text), floating `ShortlistBar` + drawer. **The Investment mechanic.**
- `components/CinematicReveal.tsx` — Attention hero.
- `components/Explorer.tsx` — Interest + Action + Variable Reward.
- `RevealLines` / `Reveal` / `RevealImage` / `CountUp` — motion that rewards scrolling.

## Where to tune the funnel

- **Scarcity numbers** come from live availability (`/api/apartments` + admin) — edit statuses in `/admin` and the "Only N remain" copy updates across the site.
- **CTAs** all point to `#contact` (viewing) or `#explorer` / `/apartments` (selection) — one destination per intent.
