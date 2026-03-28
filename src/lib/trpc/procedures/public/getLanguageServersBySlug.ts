import { z } from 'zod';
import { t } from '../../t';
import * as LanguageServerService from '$lib/server/prisma/languageservers/service';

export const getLanguageServersBySlug = t.procedure
  .input((input: unknown) => {
    return z.object({ username: z.string(), slug: z.string() }).parse(input);
  })
  .query(async ({ input: { username, slug } }) => {
    return LanguageServerService.getLanguageServersBySlug(username, slug);
  });
