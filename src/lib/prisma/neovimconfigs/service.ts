import type { NeovimConfig, NeovimConfigPlugins, NeovimPluginManager } from '@prisma/client';
import { prismaClient } from '../client';
import { getManyPlugins, type NeovimPluginIdentifier } from '../neovimplugins/service';
import type { CreateNeovimConfigDTO } from './schema';

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

export async function updatePluginManager(id: number, pluginManager: NeovimPluginManager) {
	const config = await prismaClient.neovimConfig.update({ where: { id }, data: { pluginManager } });
	return config;
}

export async function getConfigWithPlugins(id: number) {
	return prismaClient.neovimConfig.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			plugins: true
		}
	});
}

export async function addPlugins(configId: number, pluginIds: number[]): Promise<void> {
	await prismaClient.neovimConfig.update({
		where: { id: configId },
		data: {
			plugins: {
				connect: pluginIds.map((id) => ({
					id
				}))
			}
		}
	});
}

export async function getConfigWithPlugins2(id: number) {
	const { neovimConfigPlugins, ...config } = await prismaClient.neovimConfig.findUniqueOrThrow({
		where: {
			id
		},
		include: {
			neovimConfigPlugins: true
		}
	});
	const pluginIds = neovimConfigPlugins.map((ncp) => ncp.pluginId);
	const plugins = await getManyPlugins(pluginIds);
	return {
		...config,
		plugins
	};
}

export async function addPlugins2(
	configId: number,
	pluginIds: number[]
): Promise<NeovimConfigPlugins[]> {
	const upsert = pluginIds.map((pluginId) => ({
		where: {
			configId_pluginId: {
				configId,
				pluginId
			}
		},
		create: {
			config: {
				connect: {
					id: configId
				}
			},
			plugin: {
				connect: {
					id: pluginId
				}
			}
		},
		update: {
			config: {
				connect: {
					id: configId
				}
			},
			plugin: {
				connect: {
					id: pluginId
				}
			}
		}
	}));
	return await Promise.all(upsert.map((u) => prismaClient.neovimConfigPlugins.upsert(u)));
}

export async function addPlugins3(configId: number, pluginIds: number[]) {
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
		.then(({neovimConfigPlugins, ...c}) => ({ ...c, plugins: neovimConfigPlugins.map((p) => p.plugin) }));
}
