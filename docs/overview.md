# Pribandos — App Overview

> Personal portfolio website for **Aditya Dewantara** (adit.dev), themed as a fantasy RPG / Dungeons & Dragons character sheet. Two-route app: a single-page home (`/`) plus a dedicated per-book route under `/library/[slug]` for the Adventurer's Library, data-driven from a headless CMS and static fallback.

---

## 1. App Overview

**Pribandos** is a personal portfolio web app for **Aditya Dewantara** (`adit.dev`) that presents the developer's profile, work experience, projects, skills, and professional network through the metaphor of a tabletop RPG character sheet. Every section borrows from fantasy-RPG vocabulary:

| Real-world concept | In-app label |
| --- | --- |
| Profile / About me | Hero section, "Aditya the Paladin" |
| Work history | Quest Log |
| Side projects / portfolio | Adventurer's Backpack / Inventory |
| Technical skills | Skill Tree |
| Recommended books | Adventurer's Library |
| Professional network / colleagues | Party |
| Footer / contact links | Guild Hall |

The app has **two route families**:
- `/` — the home page, a single-page interactive portfolio rendered as a Server Component that fetches CMS data and hands off to a root Client Component (`ClientPage.jsx`) which orchestrates state, theming, and the scroll-spy navigation.
- `/library/[slug]` — a dedicated, statically-generated page per book in the Adventurer's Library (one route per published `Blogs` record). Server Component, pre-rendered at build time, with per-page metadata and a reading-mode client wrapper.

There is no auth, no backend of its own, no multi-page navigation beyond the library. Content (homepage hero copy, experiences, projects, library books) is pulled from a **Directus** headless CMS at build time with incremental static regeneration (ISR). Static fallback content (translations, profile data) lives in `src/lib/data.js`.

The package is private (`"private": true` in `package.json`) and currently at version `0.1.0`.

---

## 2. Features

### 2.1 Single-page interactive portfolio
The entire portfolio is one page (`src/app/page.js`) rendered as a Server Component that fetches CMS data, then handed off to a root Client Component (`ClientPage.jsx`) that orchestrates state, theming, modals, and the scroll-spy navigation.

### 2.2 CMS-driven content (Directus)
`page.js` fetches three homepage Directus collections plus a lightweight library index in parallel on the server:

- `Homepage` — hero copy / profile fields
- `experiences` — work history (sorted by `-id`)
- `Projects` — portfolio items (sorted by `-id`)
- `Blogs` — published library index fields only (`id`, `slug`, `Title`, `Thumbnail`, `date_created`, `date_updated`), sorted by `-date_created`; the heavy `Content` HTML is fetched only on a detail page by ID

All requests revalidate every **60 seconds** (`next: { revalidate: 60 }`) so the page stays static-friendly while CMS edits propagate without a redeploy. Authentication uses a bearer token from `DIRECTUS_TOKEN`.

### 2.3 Bilingual content (EN / ID)
Translations for all static text (labels, headings, buttons) are bundled in `src/lib/data.js` as a `translations` object keyed by language. A language toggle exists in `ClientPage.jsx` (currently disabled — the code path is wired but the UI toggle is commented out).

### 2.4 Section navigation (scroll spy)
A sticky bottom navigation bar highlights the section currently in view using an `IntersectionObserver`. Clicking a nav item smooth-scrolls to the corresponding section.

### 2.5 Dark / light theme
Theme state lives in `ClientPage.jsx`. Toggling dark mode swaps a class on the root and persists preference client-side. Styling is driven by hand-rolled CSS rules rather than Tailwind's `dark:` variant.

### 2.6 Fate System — D20 dice mechanic
A signature interactive feature in the hero section. Clicking the D20 die (`D20.jsx`) rolls a random number 1–20:

- **Crit fail (1)** — damage the HP bar, screen-shake animation
- **Crit success (20)** — restore the mana bar, vibrate / glow animation
- **Standard roll** — purely cosmetic reveal

The die itself is a custom SVG (`D20.jsx`).

### 2.7 HP & Mana Stat Bars
Hero section displays two `StatBar` components representing HP and Mana. Their initial values are derived from the day of the week (`data.js:8-21`) — a small playful detail.

### 2.8 Quest Log (work history)
`QuestLog.jsx` renders the developer's work experience as a timeline. Each Directus `experiences` entry can have multiple `positions` (roles held at that company), grouped under one company heading. Each experience group visibly displays its CMS company name above the roles.

### 2.9 Adventurer's Backpack / Portfolio
`Portfolio.jsx` renders projects as an inventory grid with rarity-style badges (color-coded). Clicking a project opens an inspect modal with a longer description and an outbound link to the project. Project preview thumbnails are pulled from `https://cms.adit.dev/assets/...`.

### 2.10 Skill Tree
`SkillTree.jsx` groups skills into three categories (Frontend, Backend, Tools) and renders each skill as a leveled, rarity-colored bar — visually consistent with the RPG metaphor.

### 2.11 Library
The Adventurer's Library is **two halves**:

- **Home shelf** (`Library.jsx`) renders every published book from the lightweight Directus `Blogs` index as a decorative bookshelf inside the home page. Each book is a `next/link` to its dedicated `/library/[slug]` route — clicking a spine navigates instead of opening a popup. If the collection is empty or unreachable, an in-universe empty state renders instead.
- **Per-book reading page** (`src/app/library/[slug]/page.js` + `BookReader.jsx`) is a dedicated route that feels like reading a real book: a fixed parchment palette (warm cream paper, dark warm ink, papyros texture, gilt top edge), optional cover thumbnail, drop-cap first paragraph, EB Garamond serif loaded route-locally, prev/next pager with wrap-around, keyboard `← →` to turn pages, and reading-time in the byline. Only the chrome (frame, back link, pager cards) follows the home theme; the book surface itself stays parchment for both themes.

Book records come from the CMS: `src/lib/library.js` exports `fetchLibraryIndex()` for the lightweight published `Blogs` index (sorted by `-date_created`) and `fetchLibraryBookById(id)` for one full detail record from `Blogs/{id}`. The index is used by the home shelf, sitemap, static params, and metadata; detail pages resolve the public `/library/[slug]` URL to an ID before fetching the heavy `Content` HTML. Normalized index books use `{id, slug, title, thumbnail, publishedAt}`; detail books add `{excerpt, readingMinutes, content}`. See `docs/features.md` for the full deep-dive and `docs/architecture.md` for the route + data graph.

### 2.12 Party (colleagues)
`Party.jsx` renders three profile cards for colleagues / collaborators with external profile links.

### 2.13 Guild Hall (footer)
`GuildHall.jsx` is the footer with outbound links (GitHub, LinkedIn, Email) and the copyright line.

### 2.14 SEO & social metadata
`src/app/layout.js` defines rich default metadata: title template, description, OpenGraph tags, Twitter card tags. Each `/library/[slug]` route exports its own `generateMetadata` with per-book title + summary (≤160 chars) and matching OG / Twitter cards. A Next.js `sitemap.js` enumerates `/` plus the published library URLs from the light index, and `robots.js` allows all crawlers and points to the sitemap. Geist and Geist Mono are loaded globally via `next/font/google`; EB Garamond is loaded route-locally for the book pages only.

---

## 3. Technology Stack

### 3.1 Framework & language
- **Next.js `16.1.6`** — App Router (`src/app/` layout), ISR for CMS data, Server Components for the entry route
- **React `19.2.3`**
- **React Compiler** — enabled via `reactCompiler: true` in `next.config.mjs`
- **Plain JavaScript / JSX** — no TypeScript (`jsconfig.json` only defines the `@/*` → `src/*` path alias)

### 3.2 Styling
- **Tailwind CSS v4** — loaded via `@tailwindcss/postcss` in `postcss.config.mjs` and a single `@import "tailwindcss"` in `globals.css`
- No `tailwind.config.*` file (Tailwind v4 zero-config style)
- Custom font variables declared in `globals.css` via `@theme` for Geist / Geist Mono
- Dark mode is implemented manually with a class toggle on the root element

### 3.3 Content / data layer
- **Directus** headless CMS (REST API), hosted at `https://cms.adit.dev`
  - `DIRECTUS_URL` — base CMS URL
  - `DIRECTUS_TOKEN` — bearer token for read access
- **Static fallback data** in `src/lib/data.js` for labels, translations, and graceful degradation

### 3.4 Icons & assets
- **`lucide-react`** — icon library used across components
- **`public/`** — static SVG illustrations, favicons, hero avatar (`myimage.jpeg`)

### 3.5 Tooling & scripts
- **`npm run dev`** — `next dev`
- **`npm run build`** — `next build`
- **`npm run start`** — `next start`
- **`npm run lint`** — `eslint` (flat config, `eslint-config-next/core-web-vitals`)

### 3.6 Auth
- **None** in the app itself. The only credential is the Directus bearer token used for read-only CMS access.

### 3.7 No backend
- No API routes (no `route.js` files in `src/app/`)
- No database, no ORM, no middleware
- No deployment config in-repo (no `Dockerfile`, no Vercel config)

---

## 4. Project Structure

```
adit/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout, fonts, SEO metadata
│   │   ├── page.js            # Server Component: fetch CMS data, render <ClientPage/>
│   │   ├── sitemap.js         # Next.js sitemap (home + library URLs)
│   │   ├── robots.js          # robots.txt config, points to sitemap
│   │   ├── library/
│   │   │   └── [slug]/page.js # Server Component: per-book reading page
│   │   ├── globals.css        # Tailwind import + @theme + dark mode rules
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ClientPage.jsx     # Root client orchestrator (state, nav, theme)
│   │   ├── HeroSection.jsx    # Profile + HP/Mana bars + D20 dice
│   │   ├── QuestLog.jsx       # Work-experience timeline
│   │   ├── Portfolio.jsx      # Project inventory + inspect modal
│   │   ├── SkillTree.jsx      # Skills grouped by category
│   │   ├── Library.jsx        # Bookshelf on home — links to /library/[slug]
│   │   ├── BookReader.jsx     # Client wrapper for /library/[slug] reading view
│   │   ├── Party.jsx          # Colleague cards
│   │   ├── GuildHall.jsx      # Footer with social links
│   │   ├── SectionHeading.jsx # Reusable section header
│   │   ├── D20.jsx            # Custom SVG dice
│   │   └── StatBar.jsx        # Reusable HP/mana bar
│   └── lib/
│       ├── data.js            # Static fallback data + EN/ID translations
│       └── library.js         # fetchLibraryIndex() + fetchLibraryBookById(id) — Blogs index/detail API
├── public/                    # Static assets (SVGs, favicons, avatar)
├── docs/
│   ├── overview.md            # ← this file
│   ├── features.md            # Per-feature deep dives (Library, etc.)
│   ├── architecture.md        # Component graph, routes, data flow
│   └── changelog.md           # Dated, type-tagged changelog
├── next.config.mjs            # reactCompiler: true
├── postcss.config.mjs         # @tailwindcss/postcss
├── eslint.config.mjs          # eslint-config-next/core-web-vitals
├── jsconfig.json              # @/* → ./src/*
├── package.json               # v0.1.0, private
└── .env.local                 # DIRECTUS_URL, DIRECTUS_TOKEN
```

---

## 5. Environment Variables

| Variable | Purpose |
| --- | --- |
| `DIRECTUS_URL` | Base URL of the Directus CMS instance (e.g. `https://cms.adit.dev`) |
| `DIRECTUS_TOKEN` | Bearer token for read access to Directus collections |

Both are consumed in `src/app/page.js` and must be present for the CMS-driven homepage, experiences, and projects to load. If unset, the page falls back to the static data in `src/lib/data.js`.

---

## 6. Notes & Quirks

- **Library is a multi-route feature, CMS-backed** — clicking a spine on the home shelf navigates to `/library/[slug]` (a dedicated, pre-rendered page with per-page metadata) rather than opening a modal. The home shelf, sitemap, static params, and metadata use the lightweight published `Blogs` index via `fetchLibraryIndex()`; a detail page resolves `slug → id` and uses `fetchLibraryBookById(id)` to fetch one full record. The home shelf renders an in-universe empty state when the index is empty or unreachable. See `docs/features.md` §Library for the full design.
- **Collection name casing is inconsistent** in Directus: `Homepage` (uppercase), `experiences` (lowercase), `Projects` (uppercase), and `Blogs` (uppercase, plural). The API calls use each name verbatim — renaming any of them in Directus without updating the corresponding fetch will silently break the page or library.
- **Bilingual toggle is wired but disabled** — the language state and translation lookup exist; the UI control that would let users switch between EN and ID is commented out in `ClientPage.jsx`. `ClientPage` mirrors `lang` and `theme` into `localStorage` so `BookReader` on the library route can pick them up on mount.
- **Dark mode is hand-rolled**, not driven by Tailwind's `dark:` variant — toggling the theme applies a root class and custom CSS rules.
- **No tests, no CI** — the repo has no test runner, no GitHub Actions config, and minimal git history (3 commits on `main`).

---

> Last updated: 2026-08-26 — fixer.
