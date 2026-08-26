// Library data layer — server-only.
//
// The home shelf needs only lightweight metadata. The reading route first
// resolves a slug from that index, then fetches one complete Directus record
// through `/items/Blogs/{id}`. This prevents every home-page request from
// downloading the full HTML body for every published book.

const COLLECTION = 'Blogs';
const INDEX_FIELDS = 'id,slug,Title,Thumbnail,date_created,date_updated';

function getConfig() {
  const baseUrl = process.env.DIRECTUS_URL;
  const token = process.env.DIRECTUS_TOKEN;

  if (!baseUrl) {
    console.error('[library] DIRECTUS_URL is not set — returning no books');
    return null;
  }

  return { baseUrl, token };
}

function fetchOptions(token) {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 60 },
  };
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// CMS content is trusted editorial input, but still strip executable and
// embedded markup before passing it to BookReader's dangerouslySetInnerHTML.
function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '');
}

function assetUrl(baseUrl, asset) {
  const assetId = typeof asset === 'object' ? asset?.id : asset;
  if (!assetId) return null;
  return `${baseUrl.replace(/\/$/, '')}/assets/${encodeURIComponent(assetId)}`;
}

function normalizeIndex(item, baseUrl) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.Title || item.slug || 'Untitled',
    // Directus returns an asset UUID, while <img> needs the public asset URL.
    thumbnail: assetUrl(baseUrl, item.Thumbnail),
    publishedAt: item.date_created || item.date_updated || null,
  };
}

function normalizeDetail(item, baseUrl) {
  const content = sanitizeHtml(item.Content || '');
  const plainText = stripHtml(content);
  const readingMinutes = Math.max(1, Math.round(plainText.split(/\s+/).filter(Boolean).length / 200));

  return {
    ...normalizeIndex(item, baseUrl),
    // Blogs does not currently expose an Excerpt field. The title is a safe,
    // lightweight fallback for metadata until that field is added in Directus.
    excerpt: (item.Excerpt || '').trim() || (plainText.length > 180 ? `${plainText.slice(0, 177).trimEnd()}...` : plainText),
    readingMinutes,
    content,
  };
}

// Lightweight CMS list for the home shelf, sitemap, and static-param list.
// Deliberately excludes the heavy HTML `Content` field.
export async function fetchLibraryIndex() {
  const config = getConfig();
  if (!config) return [];

  try {
    const search = new URLSearchParams({
      fields: INDEX_FIELDS,
      sort: '-date_created',
      'filter[status][_eq]': 'published',
    });
    const res = await fetch(
      `${config.baseUrl}/items/${COLLECTION}?${search.toString()}`,
      fetchOptions(config.token)
    );

    if (!res.ok) {
      console.error(`[library] Directus index fetch failed with status ${res.status}`);
      return [];
    }

    const json = await res.json();
    return (json?.data || [])
      .map((item) => normalizeIndex(item, config.baseUrl))
      .filter((book) => book.id && book.slug);
  } catch (error) {
    console.error('[library] Error fetching library index:', error);
    return [];
  }
}

// Detail fetch by Directus primary key. Only the selected book's HTML body is
// transferred to the detail route.
export async function fetchLibraryBookById(id) {
  const config = getConfig();
  if (!config || !id) return null;

  try {
    const res = await fetch(
      `${config.baseUrl}/items/${COLLECTION}/${encodeURIComponent(id)}`,
      fetchOptions(config.token)
    );

    if (!res.ok) {
      console.error(`[library] Directus detail fetch failed with status ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json?.data ? normalizeDetail(json.data, config.baseUrl) : null;
  } catch (error) {
    console.error('[library] Error fetching library detail:', error);
    return null;
  }
}
