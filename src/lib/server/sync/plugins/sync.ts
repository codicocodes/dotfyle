import { fetchGitCommits, fetchGithubRepositoryByName, fetchReadme, fetchRepoFileTree } from '$lib/server/github/api';
import type { GithubRepository } from '$lib/server/github/schema';
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
		const repo = await fetchGithubRepositoryByName(this.token, this.plugin.owner, this.plugin.name);
    this.syncStars(repo),

		await Promise.all([
			this.syncReadme(repo.default_branch),
			this.syncBreakingChanges(),
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

	async syncStars(repo: GithubRepository) {
		this.plugin.stars = repo.stargazers_count;
		this.plugin.shortDescription = repo.description ?? this.plugin.shortDescription;
	}

	async syncReadme(default_branch: string) {
		let readme = await fetchReadme(this.token, this.plugin.owner, this.plugin.name);
		readme = this.mediaParser.replaceInvalidGithubUrls(readme);
		this.plugin.readme = readme;
		this.syncMedia(default_branch, readme);
    this.syncHasDotfyleShield(readme);
	}

	async syncMedia(default_branch: string, readme: string) {
    const getCurrentSha = async () => {
      const tree = await fetchRepoFileTree(this.token, this.plugin.owner, this.plugin.name, default_branch)
      return tree.sha
    }
		const media = await this.mediaParser.findMediaUrls(getCurrentSha, readme, this.plugin.owner, this.plugin.name);
		const data = await Promise.all(
			media.map(async (url) => {
				return fetch(url).then((r) => ({
					url,
					type: r.headers.get('Content-Type') ?? "",
					neovimPluginId: this.plugin.id
				}));
			})
		);
		await prismaClient.media.createMany({
			skipDuplicates: true,
			data
		});
	}
  
  syncHasDotfyleShield(readme: string) {
    if (!this.plugin.dotfyleShieldAddedAt) {
      const shieldMatch = `https://dotfyle.com/plugins/${this.plugin.owner}/${this.plugin.name}/shield`
      if (readme.includes(shieldMatch)) {
        this.plugin.dotfyleShieldAddedAt = new Date()
      }
    }
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
