# Features — Deep Dives

One file per meaningful feature. This index mirrors the section order in `docs/overview.md`.

## Index

- [Library](#library-adventurers-library) — the dedicated `/library/[slug]` reading system

---

## Library — Adventurer's Library

The Library is the only multi-route feature in the app. It pairs a decorative shelf on the home page with a dedicated reading page per book.

### What the user sees

1. On the home page, the `#library` section renders a parchment shelf with **one spine per published book** (fetched live from Directus). Hovering a spine lifts it and reveals its title; clicking navigates to `/library/<slug>`. If the collection is empty or unreachable, an in-universe empty state renders instead of the shelf.
2. The reading page is a quiet, focused view:
   - A back link to `/#library` in the top chrome.
   - A "book" surface (cream paper, papyros texture, gilt top edge) with the archival record label, large serif title, ornamental divider, italic byline (author when present, publish date, reading time), and an optional cover thumbnail.
   - A drop-cap first paragraph, generous `leading-[1.85]` body, ornament at the end.
   - Prev / Next pager cards (wrap around), with keyboard `← →` to turn pages.
   - Bottom back link.
3. Language and theme are read from `localStorage` on mount (written by `ClientPage`), so a reader on the home page who hasn't toggled still gets the right defaults (`en` / `dark`). Language drives the chrome labels only — the book body is single-lang.

### Files involved

| File | Role |
| --- | --- |
| `src/lib/library.js` | Exports `fetchLibraryIndex()` for the lightweight published index and `fetchLibraryBookById(id)` for one full `Blogs/{id}` detail record; both use ISR revalidation. |
| `src/components/Library.jsx` | Renders the home shelf (N `next/link` spines) or an empty state. |
| `src/app/library/[slug]/page.js` | Server Component — resolves slug, `generateStaticParams` pre-renders all routes, `generateMetadata` per-book SEO, `dynamicParams = false`. |
| `src/components/BookReader.jsx` | The only client island — lang/theme from `localStorage`, prev/next keyboard handler, parchment rendering, conditional cover thumbnail. |
| `src/app/page.js` | Fetches the lightweight `Blogs` index in parallel and passes normalized `libraryBooksData` to `<ClientPage>`. |
| `src/app/sitemap.js` | Sitemap: home + N book URLs. |
| `src/app/robots.js` | robots.txt config. |
| `src/components/ClientPage.jsx` | Passes `libraryBooksData` to `<Library>`; mirrors `lang`/`isDarkMode` into `localStorage` (write-only). |

### Data shape

The lightweight index returned by `fetchLibraryIndex()`:

```js
{
  id:             number,
  slug:           string,
  title:          string,
  thumbnail:      string | null,   // Directus asset UUID; optional cover on the detail page
  publishedAt:    string,          // ISO date
}
```

The detail record returned by `fetchLibraryBookById(id)` adds the fields needed by the reader:

```js
{
  id:             number,
  slug:           string,
  title:          string,
  thumbnail:      string | null, // Directus asset UUID normalized to /assets/{id} URL
  publishedAt:    string,          // ISO date
  excerpt:        string,
  readingMinutes: number,
  content:        string,          // sanitized HTML
}
```

The raw CMS record uses `Title`, `Content`, `Thumbnail`, `date_created`, and `date_updated`; `library.js` normalizes these to the UI fields above. `Content` is HTML. Before it reaches `BookReader`, `library.js` removes `<script>`, `<style>`, `<iframe>`, `<object>`, and `<embed>` elements, inline `on*` handlers, and `javascript:` URLs. The remaining HTML is rendered as one `dangerouslySetInnerHTML` subtree, preserving nested Directus `<div>` / `<pre>` code snippets and preventing the hydration mismatch caused by splitting them into separate React nodes. The first paragraph still gets the drop-cap, and a short ornament (`◆ ◆ ◆`) closes the body.

Every book has a `thumbnail` field. When set to a public image URL, `BookReader` renders it as a cover inside the parchment article surface (below the gilt edge, above the header) with a lazy-loading `<img>`. When `thumbnail` is null/undefined/empty, no figure is rendered and no broken image appears. It only shows on the detail page; the home shelf (`Library.jsx`) does not use it.

### Slug convention

Slugs come from the CMS — each `Blogs` row's `slug` field is used verbatim as the public `/library/[slug]` route. There is no local slug generation; the CMS author controls the URL. Uniqueness across rows is the CMS's responsibility. After the index resolves `slug → id`, the detail request uses the Directus primary-key endpoint `Blogs/{id}`.

### SEO

- Per-book `<title>` is `book.title`. The root layout's `metadata.title.template = "%s | The Guild Hall"` appends the site suffix.
- `description` is `book.excerpt` truncated to 160 chars.
- `openGraph` and `twitter` mirror the same title + description; `openGraph.type` is `'article'`.
- `sitemap.js` exposes `/` and every `/library/<slug>` URL with `changeFrequency: 'weekly'` (home) and `'monthly'` (books).
- `robots.js` allows all crawlers and points at the sitemap.

### Theme strategy

The book surface is **fixed parchment** in both themes — a deliberate, calm reading-room contrast to the busy home page. Only the chrome (page frame, back link, pager cards) responds to the home theme, which is read from `localStorage`:

- `dark` → walnut desk: `#14100b` background, `#cfc3ab` text.
- `light` → warm linen: `#e7ddc8` background, `#3d2f23` text.

Both are slightly darker than the parchment paper so the book visually sits forward.

### Bilingual content

Every user-visible string in the chrome comes from `translations[lang].ui.*`. The book body is single-lang from the CMS (`book.content`) — it does not switch with the reader's language. Translation keys referenced by `BookReader`:

- `ui.backToLibrary`, `ui.previousBook` (or fallback `ui.prevBook`), `ui.nextBook`
- `ui.pennedBy`, `ui.recorded`, `ui.archivalRecord`
- `ui.readingTime`, `ui.turnPage`

The `lang` state still drives the chrome UI labels, but the book fields are single-lang.

### Why not keep the popup?

A modal popup: blocks crawlers, can't be deep-linked, can't be shared, lives entirely inside JavaScript. A dedicated route: N statically-generated, crawlable, linkable, pre-rendered pages with rich per-page metadata — the largest single SEO win on this site, and a much calmer reading experience.

### Adding a book

Adding a book is now a CMS operation — create and publish a row in the `Blogs` collection with `status=published` and a slug. It appears on the next ISR cycle (60s). The home shelf, the `/library/[slug]` route, and the sitemap all update automatically.

---

*Last updated: 2026-08-26 — fixer.*
