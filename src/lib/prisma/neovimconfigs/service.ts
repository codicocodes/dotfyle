import type { NeovimConfig, NeovimPluginManager } from '@prisma/client';
import { prismaClient } from '../client';
import type { CreateNeovimConfigDTO, NeovimConfigWithPlugins, NestedNeovimConfigWithPlugins } from './schema';

export async function upsertNeovimConfig(
	userId: number,
	config: CreateNeovimConfigDTO
): Promise<NeovimConfig> {
	const { owner, repo, root } = config;
	const data = {
		userId,
		...config
	};
	const user = await prismaClient.neovimConfig.upsert({
		where: { owner_repo_root: { owner, repo, root } },
		create: data,
		update: data
	});
	return user;
}

export async function updatePluginManager(
	id: number,
	pluginManager: NeovimPluginManager
): Promise<NeovimConfig> {
	const config = await prismaClient.neovimConfig.update({ where: { id }, data: { pluginManager } });
	return config;
}

export async function getConfigWithPlugins(id: number): Promise<NeovimConfigWithPlugins> {
	const config = await prismaClient.neovimConfig.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			neovimConfigPlugins: {
				include: {
					plugin: true
				}
			}
		}
	});
	return attachPlugins(config);
}

export async function addPlugins(
	configId: number,
	pluginIds: number[]
): Promise<NeovimConfigWithPlugins> {
	// TODO: add sync id in create, or maybe config.sha?
	const upsert = pluginIds.map((pluginId) => ({
		where: {
			configId_pluginId: {
				configId,
				pluginId
			}
		},
		update: {
			plugin: {
				connect: {
					id: pluginId
				}
			}
		},
		create: {
			plugin: {
				connect: {
					id: pluginId
				}
			}
		}
	}));
	return await prismaClient.neovimConfig
		.update({
			include: {
				neovimConfigPlugins: {
					include: {
						plugin: true
					}
				}
			},
			where: { id: configId },
			data: {
				neovimConfigPlugins: {
					upsert
				}
			}
		})
		.then(attachPlugins);
}
 
function attachPlugins({ neovimConfigPlugins, ...config }: NestedNeovimConfigWithPlugins): NeovimConfigWithPlugins {
  return {
    ...config,
			plugins: neovimConfigPlugins.map((p) => p.plugin)
  }
}
