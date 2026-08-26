import { fetchLibraryIndex } from '../lib/library';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://adit.dev';

export default async function sitemap() {
  const now = new Date();
  const books = await fetchLibraryIndex();
  const bookUrls = books.map((b) => ({
    url: `${SITE_URL}/library/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    ...bookUrls,
  ];
}
