import type { NeovimConfig, NeovimPluginManager } from '@prisma/client';
import { prismaClient } from '../client';
import type {
	CreateNeovimConfigDTO,
	NeovimConfigWithMetaData,
	NeovimConfigWithPlugins,
	NeovimConfigWithToken,
	NestedNeovimConfigWithMetaData,
	NestedNeovimConfigWithPlugins
} from './schema';

export async function getConfigsWithToken(): Promise<NeovimConfigWithToken[]> {
	const configs = await prismaClient.neovimConfig.findMany({
		include: {
			user: {
				select: {
					githubToken: {
						select: {
							accessToken: true
						}
					}
				}
			}
		}
	});
	return configs
		.map(({ user, ...config }) => {
			return {
				...config,
				_token: user.githubToken?.accessToken
			};
		})
		.filter((c) => !!c._token) as NeovimConfigWithToken[];
}

export async function getConfigsForPlugin(
	owner: string,
	name: string,
	take: number
): Promise<NeovimConfigWithMetaData[]> {
	const configs = await prismaClient.neovimConfig.findMany({
		include: {
			user: {
				select: {
					avatarUrl: true
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		where: {
			neovimConfigPlugins: {
				some: {
					plugin: {
						owner,
						name
					}
				}
			}
		},
		orderBy: [
			{
				stars: 'desc'
			},
			{
				repo: 'asc'
			},
			{
				root: 'asc'
			}
		],
		take
	});
	return configs.map(attachMetaData);
}

export async function getConfigBySlug(
	owner: string,
	slug: string
): Promise<NeovimConfigWithMetaData> {
	const config = await prismaClient.neovimConfig.findFirstOrThrow({
		include: {
			user: {
				select: {
					avatarUrl: true
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		where: {
			slug,
			user: {
				username: owner
			}
		},
		orderBy: [
			{
				stars: 'desc'
			},
			{
				repo: 'asc'
			},
			{
				root: 'asc'
			}
		]
	});
	return attachMetaData(config);
}

export async function getConfigsByUsername(username: string): Promise<NeovimConfigWithMetaData[]> {
	const configs = await prismaClient.neovimConfig.findMany({
		include: {
			user: { select: { avatarUrl: true } },
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		where: { user: { username } },
		orderBy: [{ stars: 'desc' }, { repo: 'asc' }, { root: 'asc' }]
	});
	return configs.map(attachMetaData);
}
export async function upsertNeovimConfig(
	userId: number,
	config: CreateNeovimConfigDTO
): Promise<NeovimConfig> {
	const lastSyncedAt = new Date();
	const { owner, repo, root } = config;
	const data = { userId, lastSyncedAt, ...config };
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

export async function removePlugins(configId: number, pluginIds: number[]): Promise<void> {
	await prismaClient.neovimConfigPlugins.deleteMany({
		where: {
			configId,
			OR: pluginIds.map((pluginId) => {
				return {
					pluginId
				};
			})
		}
	});
}

export async function syncLanguageServers(id: number, languageServers: string[]) {
	await prismaClient.neovimConfig.update({
		where: {
			id
		},
		data: {
      languageServerMappings: {
				deleteMany: {
					languageServerName: {
						notIn: languageServers
					},
				},
        connectOrCreate: languageServers.map((languageServerName) => {
          return {
            where: {
              languageServerName_configId: {
                configId: id,
                languageServerName,
              }
            },
            create: {
              configId: id,
              languageServerName,
            }
          };
        })
      },
		}
	});
}

export async function getMissingPluginIds(configId: number, freshPluginIds: number[]) {
	return prismaClient.neovimConfigPlugins
		.findMany({
			select: {
				pluginId: true
			},
			where: {
				configId,
				NOT: freshPluginIds.map((pluginId) => {
					return {
						pluginId
					};
				})
			}
		})
		.then((plugins) => plugins.map((plugin) => plugin.pluginId));
}

export async function addPlugins(
	configId: number,
	sha: string,
	pluginIds: number[]
): Promise<NeovimConfigWithPlugins> {
	const connectOrCreate = pluginIds.map((pluginId) => ({
		where: {
			configId_pluginId: {
				configId,
				pluginId
			}
		},
		create: {
			plugin: {
				connect: {
					id: pluginId
				}
			},
			sync: {
				connectOrCreate: {
					where: {
						configId_sha: {
							configId,
							sha
						}
					},
					create: {
						sha,
						config: {
							connect: {
								id: configId
							}
						}
					}
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
					connectOrCreate
				}
			}
		})
		.then(attachPlugins);
}

export async function saveLeaderkey(id: number, leaderkey: string): Promise<NeovimConfig> {
	return await prismaClient.neovimConfig.update({
		where: {
			id
		},
		data: {
			leaderkey
		}
	});
}

export async function searchNeovimConfigs(pluginIdentifiers: string[] | undefined) {
	const configs = await prismaClient.neovimConfig.findMany({
		where: {
			...(pluginIdentifiers && pluginIdentifiers.length > 0
				? {
						AND: pluginIdentifiers.map((identifier) => {
							const [owner, name] = identifier.split('/');
							return {
								neovimConfigPlugins: {
									some: {
										plugin: {
											owner,
											name
										}
									}
								}
							};
						})
				  }
				: {})
		},
		include: {
			user: {
				select: {
					avatarUrl: true
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return configs.map(attachMetaData);
}

export async function getNewestNeovimConfigs(): Promise<NeovimConfigWithMetaData[]> {
	const configs = await prismaClient.neovimConfig.findMany({
		include: {
			user: {
				select: {
					avatarUrl: true
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 6
	});

	return configs.map(attachMetaData);
}

function attachMetaData({
	_count,
	user,
	...config
}: NestedNeovimConfigWithMetaData): NeovimConfigWithMetaData {
	return {
		...config,
		ownerAvatar: user.avatarUrl,
		pluginCount: _count.neovimConfigPlugins
	};
}

function attachPlugins({
	neovimConfigPlugins,
	...config
}: NestedNeovimConfigWithPlugins): NeovimConfigWithPlugins {
	return {
		...config,
		plugins: neovimConfigPlugins.map((p) => p.plugin)
	};
}
