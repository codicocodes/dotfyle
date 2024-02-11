import { prismaClient } from '../client';
import type { FormattedNeovimConfigSync } from './schema';

export async function getNeovimConfigSyncs(
	username: string,
	slug: string
): Promise<FormattedNeovimConfigSync[]> {
	const syncs = await prismaClient.neovimConfigSync.findMany({
		include: {
			syncedPlugins: {
				include: {
					plugin: {
						select: {
							owner: true,
							name: true
						}
					}
				}
			},
			syncedLanguageServers: {
				select: {
					languageServerName: true
				}
			}
		},
		where: {
			config: {
				user: {
					username
				},
				slug
			}
		},
		orderBy: [
			{
				syncedAt: 'desc'
			}
		]
	});
	return syncs.map((sync) => ({
		...sync,
		syncedLanguageServers: sync.syncedLanguageServers.map((ls) => ls.languageServerName),
		syncedPlugins: sync.syncedPlugins.map(
			(plugin) => `${plugin.plugin.owner}/${plugin.plugin.name}`
		)
	}));
}
