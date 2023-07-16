import { createNeovimConfigSlug } from '$lib/server/nvim-sync/config/syncRepoInfo';
import type {
	NeovimConfig,
	NeovimPluginManager,
	GithubRepository,
	NvimConfig,
	ToolConfig
} from '@prisma/client';
import { prismaClient } from '../client';
import { paginator } from '../pagination';
import type {
	CreateNeovimConfigDTO,
	NeovimConfigWithMetaData,
	NeovimConfigWithPlugins,
	NeovimConfigWithToken,
	NestedNeovimConfigWithMetaData,
	NestedNeovimConfigWithPlugins
} from './schema';

const sortings = {
	plugins: {
		neovimConfigPlugins: {
			_count: 'desc'
		}
	},
	new: {
		createdAt: 'desc'
	},
	stars: [
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
} as const;

const flattenNestedNvimConfig = (
	nvimConfig: NvimConfig,
	toolConfig: ToolConfig,
	repository: GithubRepository
): NeovimConfig => {
	if (!repository.userId) throw new Error('GithubRepository must be connected to a user');
	return {
		id: nvimConfig.id, // TODO: repository.id should be main identifier at the end of this migrations, and this `flattenNestedNvimConfig` should not exist
		owner: repository.owner,
		slug: createNeovimConfigSlug(repository.name, toolConfig.root),
		repo: repository.name,
		root: toolConfig.root,
		initFile: nvimConfig.initFile,
		branch: repository.mainBranch,
		leaderkey: nvimConfig.leaderkey,
		fork: repository.fork,
		githubId: repository.githubId,
		stars: repository.stars,
		userId: repository.userId,
		pluginManager: nvimConfig.pluginManager as NeovimPluginManager,
		createdAt: repository.createdAt,
		lastSyncedAt: nvimConfig.lastSyncedAt
	};
};

export async function getConfigsWithToken(): Promise<NeovimConfigWithToken[]> {
	const configs = await prismaClient.nvimConfig.findMany({
		include: {
			toolConfig: {
				include: {
					repository: {
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
					}
				}
			}
		}
	});
	return configs
		.map(
			({
				toolConfig: {
					repository: { user, ...repository },
					...toolConfig
				},
				...config
			}) => {
				return {
					...flattenNestedNvimConfig(config, toolConfig, repository),
					_token: user!.githubToken?.accessToken
				};
			}
		)
		.filter((c) => !!c._token) as NeovimConfigWithToken[];
}

export async function getConfigsForPlugin(
	owner: string,
	name: string,
	take: number
): Promise<NeovimConfigWithMetaData[]> {
	const configs = await prismaClient.nvimConfig.findMany({
		include: {
			toolConfig: {
				include: {
					repository: {
						include: {
							user: {
								select: {
									avatarUrl: true
								}
							}
						}
					}
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
				toolConfig: {
					repository: {
						stars: 'desc'
					}
				}
			},
			{
				toolConfig: {
					repository: {
						name: 'asc'
					}
				}
			},
			{
				toolConfig: {
					root: 'asc'
				}
			}
		],
		take
	});

	return configs.map((nestedConfig) => {
		const {
			toolConfig: {
				repository: { user, ...repository },
				...toolConfig
			},
			...config
		} = nestedConfig;
		return {
			...flattenNestedNvimConfig(config, toolConfig, repository),
			ownerAvatar: user!.avatarUrl,
			pluginCount: nestedConfig._count.neovimConfigPlugins
		};
	});
}

export async function getConfigBySlug(
	owner: string,
	slug: string
): Promise<NeovimConfigWithMetaData> {
	const {
		toolConfig: {
			repository: { user, ...repository },
			...toolConfig
		},
		...config
	} = await prismaClient.nvimConfig.findFirstOrThrow({
		include: {
			toolConfig: {
				include: {
					repository: {
						include: {
							user: {
								select: {
									avatarUrl: true
								}
							}
						}
					}
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		where: {
			toolConfig: {
				slug: slug,
				repository: {
					owner,
					user: {
						username: owner
					}
				}
			}
		},
		orderBy: [
			{
				toolConfig: {
					repository: {
						stars: 'desc'
					}
				}
			},
			{
				toolConfig: {
					repository: {
						name: 'asc'
					}
				}
			},
			{
				toolConfig: {
					root: 'asc'
				}
			}
		]
	});
	return {
		...flattenNestedNvimConfig(config, toolConfig, repository),
		ownerAvatar: user!.avatarUrl,
		pluginCount: 1
	};
}

export async function getConfigsByUsername(username: string): Promise<NeovimConfigWithMetaData[]> {
	const configs = await prismaClient.nvimConfig.findMany({
		include: {
			toolConfig: {
				include: {
					repository: {
						include: {
							user: {
								select: {
									avatarUrl: true
								}
							}
						}
					}
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		where: {
			toolConfig: {
				repository: {
					user: {
						username
					}
				}
			}
		},
		orderBy: [
			{
				toolConfig: {
					repository: {
						stars: 'desc'
					}
				}
			},
			{
				toolConfig: {
					repository: {
						name: 'asc'
					}
				}
			},
			{
				toolConfig: {
					root: 'asc'
				}
			}
		]
	});
	return configs.map(
		({
			toolConfig: {
				repository: { user, ...repository },
				...toolConfig
			},
			...config
		}) => {
			return {
				...flattenNestedNvimConfig(config, toolConfig, repository),
				ownerAvatar: user!.avatarUrl,
				pluginCount: config._count.neovimConfigPlugins
			};
		}
	);
}
export async function upsertNeovimConfig(
	userId: number,
	configDTO: CreateNeovimConfigDTO
): Promise<NeovimConfig> {
	const lastSyncedAt = new Date();
	const { config, toolConfig, repository } = await prismaClient.$transaction(async (tx) => {
		const repository = await tx.githubRepository.upsert({
			where: {
				githubId: configDTO.githubId
			},
			create: {
				githubId: configDTO.githubId,
				mainBranch: configDTO.branch,
				stars: configDTO.stars,
				name: configDTO.repo,
				owner: configDTO.owner,
				fork: configDTO.fork,
				userId: userId
			},
			update: {
				githubId: configDTO.githubId,
				mainBranch: configDTO.branch,
				stars: configDTO.stars,
				name: configDTO.repo,
				owner: configDTO.owner,
				fork: configDTO.fork,
				userId: userId
			}
		});

		const toolConfig = await tx.toolConfig.upsert({
			where: {
				repositoryId_root: {
					repositoryId: repository.id,
					root: configDTO.root
				}
			},
			create: {
				slug: configDTO.slug,
				root: configDTO.root ?? '/',
				repositoryId: repository.id,
				toolName: 'neovim'
			},
			update: {
				slug: configDTO.slug,
				root: configDTO.root ?? '/',
				repositoryId: repository.id,
				toolName: 'neovim'
			}
		});

		const config = await tx.nvimConfig.upsert({
			where: {
				toolConfigId: toolConfig.id
			},
			create: {
				initFile: configDTO.initFile,
				toolConfigId: toolConfig.id,
				lastSyncedAt
			},
			update: {
				initFile: configDTO.initFile,
				lastSyncedAt
			}
		});
		return {
			repository,
			toolConfig,
			config
		};
	});
	return flattenNestedNvimConfig(config, toolConfig, repository);
}

export async function updatePluginManager(
	id: number,
	pluginManager: NeovimPluginManager
): Promise<NeovimConfig> {
	const nestedConfig = await prismaClient.nvimConfig.update({
		include: {
			toolConfig: {
				include: {
					repository: true
				}
			}
		},
		where: { id },
		data: { pluginManager }
	});
  const {
    toolConfig: {
      repository,
      ...toolConfig
    },
    ...config
  } = nestedConfig;
	return flattenNestedNvimConfig(config, toolConfig, repository)
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

export async function syncLanguageServers(id: number, sha: string, languageServers: string[]) {
	await prismaClient.nvimConfig.update({
		where: {
			id
		},
		data: {
			languageServerMappings: {
				deleteMany: {
					languageServerName: {
						notIn: languageServers
					}
				},
				connectOrCreate: languageServers.map((languageServerName) => {
					return {
						where: {
							languageServerName_configId: {
								configId: id,
								languageServerName
							}
						},
						create: {
							languageServer: {
								connectOrCreate: {
									where: {
										name: languageServerName
									},
									create: {
										name: languageServerName
									}
								}
							},
							sync: {
								connectOrCreate: {
									where: {
										configId_sha: {
											configId: id,
											sha
										}
									},
									create: {
										sha,
										config: {
											connect: {
												id
											}
										}
									}
								}
							}
						}
					};
				})
			}
		}
	});
}

export async function syncConfigPlugins(
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
					connectOrCreate,
					deleteMany: {
						configId,
						pluginId: {
							notIn: pluginIds
						}
					}
				}
			}
		})
		.then(attachPlugins);
}

export async function saveLeaderkey(id: number, leaderkey: string) {
	return await prismaClient.nvimConfig.update({
		where: {
			id
		},
		data: {
			leaderkey
		}
	});
}

export type ConfigSearchOptions = {
	query?: string | undefined;
	plugins?: string[];
	languageServers?: string[];
	sorting: 'new' | 'stars' | 'plugins';
	page?: number;
	take?: number;
};

export async function searchNeovimConfigs({
	query,
	plugins,
	languageServers,
	sorting,
	page,
	take
}: ConfigSearchOptions) {
	const queries = query?.split('/');
	const mode = 'insensitive';
	const args = {
		where: {
			...(query && queries
				? queries.length > 1
					? {
							AND: [
								{ owner: { contains: queries[0], mode } },
								{ repo: { contains: queries[1], mode } }
							]
					  }
					: {
							OR: [{ owner: { contains: query, mode } }, { repo: { contains: query, mode } }]
					  }
				: {}),
			...(plugins && plugins.length > 0
				? {
						AND: plugins.map((identifier) => {
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
				: {}),
			...(languageServers && languageServers.length > 0
				? {
						AND: languageServers.map((languageServerName) => {
							return {
								languageServerMappings: {
									some: {
										languageServerName
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
		orderBy: sortings[sorting]
	};

	const { data: nestedConfigData, meta } = await paginator({
		perPage: take
	})<NestedNeovimConfigWithMetaData>(prismaClient.neovimConfig, args, { page });
	const data = nestedConfigData.map(attachMetaData);
	return {
		data,
		meta
	};
}

export async function getNewestNeovimConfigs(): Promise<NeovimConfigWithMetaData[]> {
	const nvimConfigs = await prismaClient.nvimConfig.findMany({
		include: {
			toolConfig: {
				include: {
					repository: {
						include: {
							user: {
								select: {
									avatarUrl: true
								}
							}
						}
					}
				}
			},
			_count: {
				select: {
					neovimConfigPlugins: true
				}
			}
		},
		orderBy: {
			toolConfig: {
				repository: {
					createdAt: 'desc'
				}
			}
		},
		take: 6
	});

	return nvimConfigs.map(
		({
			toolConfig: {
				repository: { user, ...repository },
				...toolConfig
			},
			...config
		}) => {
			return {
				...flattenNestedNvimConfig(config, toolConfig, repository),
				ownerAvatar: user!.avatarUrl,
				pluginCount: config._count.neovimConfigPlugins
			};
		}
	);
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
