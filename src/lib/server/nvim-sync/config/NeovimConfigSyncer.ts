import { fetchRepoFileTree } from '$lib/server/github/api';
import type { GithubTree } from '$lib/server/github/schema';
import type { NeovimConfigWithPlugins } from '$lib/server/prisma/neovimconfigs/schema';
import {
	syncConfigPlugins,
	saveLeaderkey,
	syncLanguageServers,
	updatePluginManager,
	getConfigWithPlugins
} from '$lib/server/prisma/neovimconfigs/service';
import type { NeovimPluginIdentifier } from '$lib/server/prisma/neovimplugins/schema';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { NeovimPluginManager, type NeovimConfig, type User } from '@prisma/client';
import { GithubFileContentTraverser } from './FileContentTraverser';
import { findKnownLanguageServers } from './LanguageServerFinder';
import { findPluginManager } from './NeovimPluginFinder';

export class NeovimConfigSyncer {
	foundPlugins: Set<number> = new Set();
	treeTraverser: GithubFileContentTraverser;
	syncedPluginManager = false;
	leaderkey = 'unknown';
	languageServers: string[] = [];
	constructor(
		token: string,
		private tree: GithubTree,
		public config: NeovimConfig,
		private trackedPlugins: NeovimPluginIdentifier[]
	) {
		this.treeTraverser = new GithubFileContentTraverser(
			token,
			config.owner,
			config.repo,
			tree,
			config.root
		);
	}

	async treeSync(): Promise<NeovimConfigWithPlugins> {
		const pluginManager = findPluginManager(this.tree, this.config);
		if (pluginManager) {
			this.config = await updatePluginManager(this.config.id, pluginManager);
			this.syncedPluginManager = true;
			// TODO: simple plugin finder to identify untracked plugins?
		}
		return await this.fileSyncer();
	}

	async fileSyncer() {
		for await (const content of this.treeTraverser.traverse()) {
			await this.syncPluginManager(content);
			this.findPlugins(content);
      this.syncLeaderKey(content)
      this.findLanguageServers(content)
		}

		await Promise.all([
			saveLeaderkey(this.config.id, this.leaderkey),
			syncLanguageServers(this.config.id, this.tree.sha, this.languageServers),
			syncConfigPlugins(this.config.id, this.tree.sha, [...this.foundPlugins])
		]);

		return getConfigWithPlugins(this.config.id);
	}

	syncLeaderKey(content: string) {
		if (this.leaderkey === 'unknown') {
			this.leaderkey = this.findLeaderKey(content) ?? this.leaderkey;
		}
	}

	findLanguageServers(content: string) {
    for (const ls of findKnownLanguageServers(content)) {
      this.languageServers.push(ls);
    }
	}

	findPlugins(content: string) {
		for (const plugin of this.trackedPlugins) {
			const { owner, name } = plugin;
			const fullName = `${owner}/${name}`;
			if (content.includes(fullName)) {
				this.foundPlugins.add(plugin.id);
			}
		}
	}

	async syncPluginManager(content: string) {
		if (this.syncedPluginManager) {
			return;
		}

		if (this.usesPacker(content)) {
			this.config = await updatePluginManager(this.config.id, NeovimPluginManager.Packer);
			this.syncedPluginManager = true;
			return;
		}

		if (this.usesLazy(content)) {
			this.config = await updatePluginManager(this.config.id, NeovimPluginManager.Lazy);
			this.syncedPluginManager = true;
			return;
		}
	}

	usesLazy(content: string): boolean {
		const identifiers = ['https://github.com/folke/lazy.nvim', 'folke/lazy.nvim'];
		for (const literal of identifiers) {
			if (content.includes(literal)) {
				return true;
			}
		}
		return false;
	}

	usesPacker(content: string): boolean {
		const packerIdentifiers = [
			'https://github.com/wbthomason/packer.nvim',
			'wbthomason/packer.nvim'
		];
		for (const literal of packerIdentifiers) {
			if (content.includes(literal)) {
				return true;
			}
		}
		return false;
	}

	findLeaderKey(content: string): string | undefined {
		for (const line of content.split('\n')) {
			if (line.includes('mapleader')) {
				const leaderSplit = line.trim().split('=');
				if (leaderSplit.length !== 2) continue;
				const leaderKey = leaderSplit[1];
				const parsedLeaderKey = leaderKey.split('--')[0].trim();
				switch (parsedLeaderKey) {
					case '"""':
					case "'\"'":
						return '"';
					case '"\'"':
					case "'''":
						return "'";
					case '"-"':
					case "'-'":
						return '-';
					case '";"':
					case "';'":
						return ';';
					case '"\\<Space>"':
					case "'\\<Space>'":
					case '"\\<space>"':
					case "'\\<space>'":
					case '" "':
					case "' '":
						return 'Space';
					case '","':
					case "','":
						return ',';
					case '"\\"':
					case "'\\'":
						return '\\';
					default:
						console.log('Could not match leaderKey', { parsedLeaderKey });
						return;
				}
			}
		}
	}
}

export async function getNeovimConfigSyncer(
	user: User,
	config: NeovimConfig
): Promise<NeovimConfigSyncer> {
	const token = await getGithubToken(user.id);
	const tree = await fetchRepoFileTree(token, config.owner, config.repo, config.branch);
	const trackedPlugins = await getAllNeovimPluginNames();
	return new NeovimConfigSyncer(token, tree, config, trackedPlugins);
}

export class NeovimConfigSyncerFactory {
	constructor(private trackedPlugins: NeovimPluginIdentifier[]) {}
	async create(token: string, config: NeovimConfig) {
		const tree = await fetchRepoFileTree(token, config.owner, config.repo, config.branch);
		return new NeovimConfigSyncer(token, tree, config, this.trackedPlugins);
	}
}
