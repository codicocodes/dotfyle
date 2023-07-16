import { prismaClient } from '../prisma/client';

export const migrateNvimConfigs = async () => {
	const tool = await prismaClient.tool.upsert({
		where: {
			name: 'neovim'
		},
		create: {
			name: 'neovim'
		},
		update: {
			name: 'neovim'
		}
	});

	// Step 2. Get all Neovim configs
	const allConfigs = await prismaClient.neovimConfig.findMany({
		include: {
			neovimConfigPlugins: true,
			languageServerMappings: true,
			syncs: true
		}
	});

	for (const c of allConfigs) {
		const repo = await prismaClient.githubRepository.upsert({
			where: {
				githubId: c.githubId,
			},
			create: {
				githubId: c.githubId,
				owner: c.owner,
				name: c.repo,
				createdAt: c.createdAt,
				stars: c.stars,
				fork: c.fork,
				mainBranch: c.branch,
        user: {
          connect: {
            id: c.userId,
          }
        }
			},
			update: {}
		});

		const toolConfig = await prismaClient.toolConfig.upsert({
			where: {
				repositoryId_root: {
					repositoryId: repo.id,
					root: c.root ?? '/'
				}
			},
			create: {
				root: c.root ?? '/',
				createdAt: c.createdAt,
        slug: c.slug,
				tool: {
					connect: {
						name: 'neovim'
					}
				},
				repository: {
					connect: {
						id: repo.id,
					}
				}
			},
			update: {}
		});

		await prismaClient.nvimConfig.upsert({
			where: {
				toolConfigId: toolConfig.id
			},
			create: {
				initFile: c.initFile,
				pluginManager: c.pluginManager ?? 'unknown',
				lastSyncedAt: c.lastSyncedAt,
				toolConfig: {
					connect: {
						id: toolConfig.id
					}
				},
				neovimConfigPlugins: {
					connect: c.neovimConfigPlugins.map((p) => {
						return {
							// hopefully this connects the nvimconfig to this mapping
							configId_pluginId: {
								configId: p.configId,
								pluginId: p.pluginId
							}
						};
					})
				},
				languageServerMappings: {
					connect: c.languageServerMappings.map((s) => {
						return {
							// hopefully this connects the nvimconfig to this current mapping
							languageServerName_configId: {
								languageServerName: s.languageServerName,
								configId: s.configId
							}
						};
					})
				},
				syncs: {
					connect: c.syncs.map((s) => {
						return {
							// hopefully this connects the nvimconfig to this current mapping
							configId_sha: {
								configId: s.configId,
								sha: s.sha
							}
						};
					})
				}
			},
			update: {}
		});
	}
};
