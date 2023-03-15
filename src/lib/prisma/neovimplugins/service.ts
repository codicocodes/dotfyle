
import type { PluginDTO } from '$lib/seeder/plugins';
import type { NeovimPlugin } from '@prisma/client';
import { prismaClient } from '../client';

export async function upsertManyNeovimPlugins(
	plugins: PluginDTO[]
): Promise<NeovimPlugin[]> {
  const savedPluginsPromise = plugins.map(async (p) => {
    const savedPlugin = await prismaClient.neovimPlugin.upsert({
      where: { owner_name: {
        owner: p.owner,
        name: p.name,
      } },
      create: p,
      update: p,
    });
    return savedPlugin;
  })
  return await Promise.all(savedPluginsPromise)
}

export interface NeovimPluginIdentifier {
  id: number;
  owner: string;
  name: string
}

export async function getManyPlugins(ids: number[]) {
  return prismaClient.neovimPlugin.findMany({
    where: {
      OR: ids.map(id => ({id}))        
    }
  })

}

export async function getAllNeovimPluginNames(): Promise<NeovimPluginIdentifier[]> {
  return await prismaClient.neovimPlugin.findMany({select: {
    id: true,
    owner: true,
    name: true,
  }})
}
