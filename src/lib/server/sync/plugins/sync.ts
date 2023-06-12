import { fetchGitCommits, fetchGithubRepositoryByName, fetchReadme } from '$lib/server/github/api';
import type { NeovimPluginWithCount } from '$lib/server/prisma/neovimplugins/schema';
import { getPlugin, updatePlugin } from '$lib/server/prisma/neovimplugins/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { hasBeenOneDay, oneWeekAgo } from '$lib/utils';
import type { NeovimPlugin } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export class PluginSyncer {
	plugin: NeovimPlugin;
	configCount: number;
	constructor(private token: string, { configCount, ...plugin }: NeovimPluginWithCount) {
		this.plugin = plugin;
		this.configCount = configCount;
	}
	async sync() {
		await Promise.all([
      this.syncStars(), 
      this.syncReadme(), 
      this.syncBreakingChanges(),
    ]);
		return this.updatePlugin();
	}

	async syncBreakingChanges() {
		const breakingChanges: { url: string; message: string }[] = [];
		if (!this.plugin.lastSyncedAt) {
			return;
		}
		if (!hasBeenOneDay(this.plugin.lastSyncedAt.toString())) {
			return;
		}
		const commits = await fetchGitCommits(
			this.token,
			this.plugin.lastSyncedAt,
			this.plugin.owner,
			this.plugin.name
		);
		const regex_1 = /\w+!:/;
		for (const commit of commits) {
			const firstCommitLine = commit.commit.message.split('\n')[0];
			if (regex_1.test(firstCommitLine)) {
				const breaking = {
					url: commit.html_url,
					message: commit.commit.message
				};
				breakingChanges.push(breaking);
			}
		}
    for (const change of breakingChanges) {
      console.log(change)
    }
		return breakingChanges;
	}

	async syncStars() {
		const repo = await fetchGithubRepositoryByName(this.token, this.plugin.owner, this.plugin.name);
		this.plugin.stars = repo.stargazers_count;
		this.plugin.shortDescription = repo.description ?? this.plugin.shortDescription;
	}

	async syncReadme() {
		const readme = await fetchReadme(this.token, this.plugin.owner, this.plugin.name);
		this.plugin.readme = readme;
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
