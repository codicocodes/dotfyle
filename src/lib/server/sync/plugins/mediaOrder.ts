/**
 * Assign each media URL its position in README order, deduping by URL and
 * keeping the first occurrence. The parser returns URLs in the order they
 * appear; this position becomes the tiebreaker for choosing the cover image
 * so the first image in the README wins by default.
 */
export function orderedUniqueMedia(urls: string[]): { url: string; position: number }[] {
  const seen = new Set<string>();
  const ordered: { url: string; position: number }[] = [];
  for (const url of urls) {
    if (seen.has(url)) continue;
    seen.add(url);
    ordered.push({ url, position: ordered.length });
  }
  return ordered;
}
