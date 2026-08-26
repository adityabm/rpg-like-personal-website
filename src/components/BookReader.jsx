'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../lib/data';

/**
 * BookReader — the single client island for /library/[slug].
 *
 * localStorage contract (read-only here; written by ClientPage):
 *   - 'lang'  : 'en' | 'id'      — reader language, defaults to 'en'
 *   - 'theme' : 'dark' | 'light' — home theme,      defaults to 'dark'
 * Both are read on mount and re-read on `storage` events so a change made in
 * another tab (or a future in-page toggle) propagates without a reload.
 *
 * Design contract:
 *   - The book surface is a FIXED parchment palette (warm cream paper, dark
 *     warm ink) in both themes — a calm reading room that deliberately
 *     contrasts the busy home page.
 *   - Only the chrome around the book (page frame, back links, pager cards)
 *     follows the stored theme.
 *   - The serif arrives from the parent page as the `--font-book-serif` CSS
 *     variable (EB Garamond, loaded route-locally via next/font).
 */

// Serif utility — kept as a plain constant so Tailwind's scanner sees the
// full class name verbatim in this file.
const SERIF = '[font-family:var(--font-book-serif)]';

// Fixed parchment palette for the book surface (theme-independent on purpose).
const PAPER = 'border-[#d4b9a3] bg-[#fbf6ec] text-[#2a1b15]';

// Theme-aware chrome palettes. Dark reads as a walnut reading desk at night,
// light as warm linen — in both, slightly darker than the page so the cream
// paper sits forward like a physical book.
const CHROME = {
  dark: 'bg-[#14100b] text-[#cfc3ab]',
  light: 'bg-[#e7ddc8] text-[#3d2f23]',
};

const CHROME_CARD = {
  dark: 'border-[#33291d] bg-[#1c1610] hover:border-amber-700/70 hover:bg-[#241c13]',
  light: 'border-[#c9b795] bg-[#f3ead8] hover:border-amber-700/70 hover:bg-[#faf3e4]',
};

export default function BookReader({ book, prevBook, nextBook }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const readPrefs = () => {
      setLang(window.localStorage.getItem('lang') === 'id' ? 'id' : 'en');
      setTheme(window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
    };
    readPrefs();
    window.addEventListener('storage', readPrefs);
    return () => window.removeEventListener('storage', readPrefs);
  }, []);

  // Turn pages with ← →, like a real book. Modified shortcuts (alt/ctrl/meta/
  // shift) and typing contexts are ignored so browser navigation is never
  // hijacked.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key === 'ArrowLeft') router.push(`/library/${prevBook.slug}`);
      if (event.key === 'ArrowRight') router.push(`/library/${nextBook.slug}`);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [router, prevBook.slug, nextBook.slug]);

  const t = translations[lang] || translations.en;
  const ui = t.ui || {};

  // The book record is single-lang from the CMS: `title`, `excerpt`,
  // `content`, `thumbnail`, `publishedAt`, `readingMinutes`. The `lang` state
  // below still drives the chrome UI labels (via `t`), but the book body no
  // longer switches by language — there is only one set of fields.
  const title = book.title;
  const author = book.author ?? '';
  // The detail endpoint returns a single sanitized HTML string. Rendering it
  // once avoids splitting nested <div>/<pre> code examples differently on
  // the server and client, which previously caused a hydration mismatch.
  const contentHtml = book.content || '';

  // Reading time is precomputed in the data layer (fetchLibraryBookById), so it
  // is read directly rather than recomputed from the word count here.
  const readingMinutes = book.readingMinutes ?? 1;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const publishedLabel = formatDate(book.publishedAt);

  const chrome = CHROME[theme] || CHROME.dark;
  const chromeCard = CHROME_CARD[theme] || CHROME_CARD.dark;

  const backLabel = ui.backToLibrary || 'Back to the Library';
  const prevLabel = ui.previousBook || ui.prevBook || 'Previous Tome';
  const nextLabel = ui.nextBook || 'Next Tome';
  const neighborTitle = (entry) => entry.title;

  const renderPagerCard = (entry, direction) => {
    const isPrev = direction === 'prev';
    return (
      <Link
        key={direction}
        href={`/library/${entry.slug}`}
        className={`group flex flex-col gap-3 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${chromeCard} ${isPrev ? 'items-start text-left' : 'items-end text-right'}`}
      >
        <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
          {isPrev && <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />}
          {isPrev ? prevLabel : nextLabel}
          {!isPrev && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
        </span>
        <span className={`text-lg leading-snug tracking-wide small-caps ${SERIF}`}>
          {neighborTitle(entry)}
        </span>
      </Link>
    );
  };

  const renderBackLink = () => (
    <Link
      href="/#library"
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] opacity-70 transition-opacity hover:opacity-100"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {backLabel}
    </Link>
  );

  return (
    <div data-book-lang={lang} data-book-theme={theme} className={`min-h-screen font-sans transition-colors duration-500 ${chrome}`}>
      {/* Top chrome — deliberately quiet */}
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8">
        {renderBackLink()}
        {/* Nav slot: reserved for the shared section nav. The scroll-spy nav
            lives on the home page and is intentionally NOT re-implemented here. */}
        <div data-nav-slot="book-reader" aria-hidden="true" />
      </header>

      <main className="px-4 pb-24 pt-10 sm:px-6">
        {/* The book */}
        <article className={`relative mx-auto max-w-3xl overflow-hidden rounded-md border shadow-[0_35px_70px_-20px_rgba(20,12,6,0.55)] ${PAPER} bg-[url('https://www.transparenttextures.com/patterns/papyros.png')]`}>
          {/* Gilt top edge */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-900/40 via-amber-700/60 to-amber-900/40" aria-hidden="true" />

          {/* Book cover — rendered only when a thumbnail is set (null/empty
              renders nothing, never an empty frame or broken image). */}
          {book.thumbnail && (
            <figure className="px-6 pt-12 sm:px-14">
              <div className="mx-auto max-w-md overflow-hidden rounded-md border border-[#d4b9a3] bg-[#fbf6ec] shadow-md">
                <img
                  src={book.thumbnail}
                  alt={`${title} — cover`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </figure>
          )}

          {/* Book header */}
          <header className="px-6 pb-12 pt-16 text-center sm:px-14 sm:pt-24">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.4em] text-amber-900/80">
              {ui.archivalRecord || 'Archival Record'}
            </p>
            <h1 className={`mt-6 text-balance text-4xl font-semibold leading-[1.15] sm:text-5xl ${SERIF}`}>
              {title}
            </h1>
            {/* Ornamental divider — thin rules flanking a diamond */}
            <div className="mt-10 flex items-center justify-center gap-5" aria-hidden="true">
              <span className="h-px w-20 bg-[#2a1b15]/25" />
              <span className="text-[10px] leading-none text-amber-800">◆</span>
              <span className="h-px w-20 bg-[#2a1b15]/25" />
            </div>
            <p className={`mt-8 text-base italic text-[#6b4f3a] sm:text-lg ${SERIF}`}>
              {ui.pennedBy || 'Penned by'} {author}{author ? ' · ' : ''}{ui.recorded || 'Recorded'} {publishedLabel} · {readingMinutes} {ui.readingTime || 'min read'}
            </p>
          </header>

          {/* The full sanitized CMS HTML is injected as one deterministic
              subtree. This handles nested code blocks without an SSR/CSR
              block-count mismatch. */}
          <div className={`book-prose mx-auto max-w-2xl px-6 pb-16 text-lg leading-[1.85] sm:px-12 sm:pb-20 ${SERIF}`}>
            {contentHtml && <div dangerouslySetInnerHTML={{ __html: contentHtml }} />}
            {/* End mark */}
            {contentHtml && (
              <p className="pt-4 text-center text-xs tracking-[0.6em] text-amber-800/70" aria-hidden="true">
                ◆ ◆ ◆
              </p>
            )}
          </div>
        </article>

        {/* Prev / Next — wrap-around neighbours */}
        <nav aria-label={`${prevLabel} / ${nextLabel}`} className="mx-auto mt-12 max-w-3xl">
          {/* Desktop: side-by-side */}
          <div className="hidden gap-4 md:grid md:grid-cols-2">
            {renderPagerCard(prevBook, 'prev')}
            {renderPagerCard(nextBook, 'next')}
          </div>
          {/* Mobile: stacked so the cards never cramp */}
          <div className="space-y-3 md:hidden">
            {renderPagerCard(prevBook, 'prev')}
            {renderPagerCard(nextBook, 'next')}
          </div>
          <p className="mt-6 hidden text-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 md:block">
            {ui.turnPage || 'Turn the page with ← →'}
          </p>
        </nav>

        {/* Bottom chrome */}
        <div className="mt-12 text-center">
          {renderBackLink()}
        </div>
      </main>
    </div>
  );
}
