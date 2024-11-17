import { prismaClient } from '../client';

export async function getMediaForPlugin(owner: string, name: string) {
  return prismaClient.media.findMany({
    where: {
      NeovimPlugin: {
        owner,
        name
      }
    }
  });
}
