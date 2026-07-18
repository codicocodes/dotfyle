import type { Prisma } from '@prisma/client';
import { prismaClient } from '../client';

// Cover-image ordering: manual thumbnail flag first, then README order
// (position; legacy rows have null position and sort last), then id for stability.
export const mediaCoverOrderBy: Prisma.MediaOrderByWithRelationInput[] = [
  { thumbnail: 'desc' },
  { position: { sort: 'asc', nulls: 'last' } },
  { id: 'asc' }
];

export async function getMediaForPlugin(owner: string, name: string) {
  return prismaClient.media.findMany({
    where: {
      NeovimPlugin: {
        owner,
        name
      }
    },
    orderBy: mediaCoverOrderBy
  });
}
