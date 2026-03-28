import { t } from '../../t';
import { prismaClient } from '$lib/server/prisma/client';

export const getLatestTwinIssue = t.procedure.query(async () => {
  return await prismaClient.twinPost.findFirst({
    select: {
      publishedAt: true,
      title: true,
      issue: true,
      content: false
    },
    where: {
      publishedAt: {
        not: null
      }
    },
    orderBy: {
      publishedAt: 'desc'
    }
  });
});
