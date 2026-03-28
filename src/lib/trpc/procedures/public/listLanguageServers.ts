import { t } from '../../t';
import * as LanguageServerService from '$lib/server/prisma/languageservers/service';

export const listLanguageServers = t.procedure.query(async () => {
  return LanguageServerService.listLanguageServers();
});
