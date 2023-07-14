import { fetchGitCommits, fetchGithubRepositoryByName, fetchReadme } from '$lib/server/github/api';
import { GithubMediaParser } from '$lib/server/media/parser';
import { upsertBreakingChange } from '$lib/server/prisma/breakingChanges/service';
import { prismaClient } from '$lib/server/prisma/client';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { getPlugin, updatePlugin } from '$lib/server/prisma/neovimplugins/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { daysAgo, hasBeenOneDay } from '$lib/utils';
import type { NeovimPlugin } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export class PluginSyncer {
	plugin: NeovimPlugin;
	configCount: number;
	mediaParser: GithubMediaParser;
	constructor(private token: string, { configCount, ...plugin }: NeovimPluginWithCount) {
		this.plugin = plugin;
		this.configCount = configCount;
		this.mediaParser = new GithubMediaParser();
	}
	async sync() {
		await Promise.all([
			// this.syncStars(),
			this.syncReadme()
			// this.syncBreakingChanges(),
		]);
		return this.updatePlugin();
	}

	async syncBreakingChanges() {
		const commits = await fetchGitCommits(
			this.token,
			this.plugin.lastSyncedAt ?? daysAgo(7),
			this.plugin.owner,
			this.plugin.name
		);
		const regex_1 = /\w+!:/;
		const breakingChangesTasks: Promise<void>[] = [];
		for (const commit of commits) {
			const firstCommitLine = commit.commit.message.split('\n')[0];
			if (regex_1.test(firstCommitLine)) {
				breakingChangesTasks.push(
					upsertBreakingChange(this.plugin.id, commit.sha, commit.html_url, commit.commit.message)
				);
			}
		}
	}

	async syncStars() {
		const repo = await fetchGithubRepositoryByName(this.token, this.plugin.owner, this.plugin.name);
		this.plugin.stars = repo.stargazers_count;
		this.plugin.shortDescription = repo.description ?? this.plugin.shortDescription;
	}

	async syncReadme() {
		let readme = await fetchReadme(this.token, this.plugin.owner, this.plugin.name);
		readme = this.mediaParser.replaceInvalidGithubUrls(readme);
		this.plugin.readme = readme;
		this.syncMedia(readme);
	}

	async syncMedia(readme: string) {
		const media = this.mediaParser.findMediaUrls(readme, this.plugin.owner, this.plugin.name);
		const data = await Promise.all(
			media.map(async (url) => {
				return fetch(url).then((r) => ({
					url,
					type: r.headers.get('Content-Type') ?? "",
					neovimPluginId: this.plugin.id
				}));
			})
		);
    console.log(data)
		await prismaClient.media.createMany({
			skipDuplicates: true,
			data
		});
	}

	async updatePlugin() {
		this.plugin.lastSyncedAt = new Date();
		await updatePlugin(this.plugin);
		return {
			configCount: this.configCount,
			...this.plugin
		};
	}
}

export async function getPluginSyncer(
	userId: number,
	owner: string,
	name: string
): Promise<PluginSyncer> {
	const token = await getGithubToken(userId);
	const plugin = await getPlugin(owner, name);
	if (plugin.lastSyncedAt && !hasBeenOneDay(plugin.lastSyncedAt.toString())) {
		throw new TRPCError({ code: 'FORBIDDEN' });
	}
	return new PluginSyncer(token, plugin);
}
