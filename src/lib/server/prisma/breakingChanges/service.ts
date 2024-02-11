import { prismaClient } from '../client';

const type = 'breaking-change';

export async function upsertBreakingChange(
	pluginId: number,
	sha: string,
	externalUrl: string,
	text: string
): Promise<void> {
	const title = text.split('\n')[0];
	await prismaClient.breakingChange.upsert({
		where: {
			externalUrl
		},
		update: {
			post: {
				update: {
					type
				}
			}
		},
		create: {
			sha,
			externalUrl,
			plugin: {
				connect: {
					id: pluginId
				}
			},
			post: {
				create: {
					title,
					text,
					type
				}
			}
		}
	});
}
