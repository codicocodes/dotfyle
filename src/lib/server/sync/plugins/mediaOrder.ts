/**
 * Assign each media URL its position, deduping by URL and keeping the first
 * occurrence. Position tiebreaks cover selection; it follows the parser's emit
 * order — grouped by source type, not strict README order. See PR #202.
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
