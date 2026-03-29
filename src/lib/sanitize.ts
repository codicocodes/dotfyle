import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

export async function sanitizeHtml(html: string) {
  const clean = await unified()
    .use(rehypeParse)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(html);
  return clean.toString();
}
