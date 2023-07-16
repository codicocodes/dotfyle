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
			neovimConfigPlugins: {
				include: {
					sync: true
				}
			},
			languageServerMappings: true,
			syncs: true
		}
	});

	for (const c of allConfigs) {
		const repo = await prismaClient.githubRepository.upsert({
			where: {
				githubId: c.githubId
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
						id: c.userId
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
						id: repo.id
					}
				}
			},
			update: {}
		});

		const nvimConfig = await prismaClient.nvimConfig.upsert({
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
				}
			},
			update: {
				initFile: c.initFile,
				pluginManager: c.pluginManager ?? 'unknown',
				lastSyncedAt: c.lastSyncedAt,
				toolConfig: {
					connect: {
						id: toolConfig.id
					}
				}
			}
		});
		// neovim config plugins
		await Promise.all(
			c.neovimConfigPlugins.map(async (p) => {
				const sync = p.sync
					? await prismaClient.nvimConfigSync.upsert({
							where: {
								sha_configId: {
									configId: nvimConfig.id,
									sha: p.sync.sha
								}
							},
							create: {
								sha: p.sync.sha,
								configId: nvimConfig.id,
								syncedAt: p.sync.syncedAt
							},
							update: {
								sha: p.sync.sha,
								configId: nvimConfig.id,
								syncedAt: p.sync.syncedAt
							}
					  })
					: undefined;

				return await prismaClient.nvimConfigPlugins.upsert({
					where: {
						configId_pluginId: {
							configId: nvimConfig.id,
							pluginId: p.pluginId
						}
					},
					create: {
						configId: nvimConfig.id,
						pluginId: p.pluginId,
						createdAt: p.createdAt,
						...(sync ? { syncId: sync.id } : {})
					},
					update: {
						configId: nvimConfig.id,
						pluginId: p.pluginId,
						createdAt: p.createdAt,
						...(sync ? { syncId: sync.id } : {})
					}
				});
			})
		);

    c.languageServerMappings.map(async l => {
      const legacySync = await prismaClient.neovimConfigSync.findFirstOrThrow({ where: {
          sha: l.sha,
          configId: l.configId,
        }
      })
      await prismaClient.nvimConfigToLanguageServer.upsert({
        where: {
          languageServerName_configId: {
            languageServerName: l.languageServerName,
            configId: nvimConfig.id
          }
        },
        create: {
          languageServer: {
            connect: {
              name: l.languageServerName,
            }
          },
          config: {
            connect: {
              id: nvimConfig.id
            }
          },
          sync: {
            connectOrCreate: {
              where: {
                sha_configId: {
                  sha: l.sha,
                  configId: nvimConfig.id,
                }
              },
              create: {
                sha: l.sha,
                configId: nvimConfig.id,
                syncedAt: legacySync.syncedAt,
              },
            }
          }
        },
        update: {
          languageServer: {
            connect: {
              name: l.languageServerName,
            }
          },
          config: {
            connect: {
              id: nvimConfig.id
            }
          },
          sync: {
            connectOrCreate: {
              where: {
                sha_configId: {
                  sha: l.sha,
                  configId: nvimConfig.id,
                }
              },
              create: {
                sha: l.sha,
                configId: nvimConfig.id,
                syncedAt: legacySync.syncedAt,
              },
            }
          }
        }

      })
    })
	}
};
