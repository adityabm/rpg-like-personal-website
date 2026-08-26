import { notFound } from 'next/navigation';
import { EB_Garamond } from 'next/font/google';
import { fetchLibraryBookById, fetchLibraryIndex } from '../../../lib/library';
import BookReader from '../../../components/BookReader';

// Serif for the reading surface only. The site loads Geist Sans/Mono globally
// in layout.js and no serif — so this route opts into EB Garamond (a classic
// book face with true italics) and scopes it to a CSS variable that cascades
// only within this page's subtree. layout.js stays untouched.
const bookSerif = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-book-serif',
});

// The library is a closed, CMS-sourced set of records — any slug outside
// generateStaticParams() is a hard 404, and every route is pre-rendered.
export const dynamicParams = false;

export async function generateStaticParams() {
  const books = await fetchLibraryIndex();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const books = await fetchLibraryIndex();
  const book = books.find((entry) => entry.slug === slug);
  if (!book) return {};

  // SEO surface — title and excerpt come from the single-lang CMS record.
  // Descriptions are capped at 160 chars; the same truncated string is reused
  // for OG/Twitter so previews never clip mid-word.
  const description = (book.excerpt || '').length > 160
    ? `${book.excerpt.slice(0, 157).trimEnd()}...`
    : (book.excerpt || '');

  return {
    title: book.title, // layout template applies: "%s | The Guild Hall"
    description,
    openGraph: { title: book.title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title: book.title, description },
  };
}

export default async function BookPage({ params }) {
  const { slug } = await params;
  const books = await fetchLibraryIndex();
  const index = books.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const book = await fetchLibraryBookById(books[index].id);
  if (!book) notFound();
  // Wrap-around neighbours: the last record leads back to the first and the
  // first leads back to the last — the archive is a loop, not a dead end.
  const prevBook = books[(index - 1 + books.length) % books.length];
  const nextBook = books[(index + 1) % books.length];

  return (
    <div className={bookSerif.variable}>
      <BookReader book={book} prevBook={prevBook} nextBook={nextBook} />
    </div>
  );
}
