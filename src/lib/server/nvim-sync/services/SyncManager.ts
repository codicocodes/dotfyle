import { fetchFile, fetchRepoFileTree } from '$lib/server/github/api';
import type { GithubTree } from '$lib/server/github/schema';
import { addPlugins, updatePluginManager } from '$lib/server/prisma/neovimconfigs/service';
import type { NeovimPluginIdentifier } from '$lib/server/prisma/neovimplugins/schema';
import { getAllNeovimPluginNames } from '$lib/server/prisma/neovimplugins/service';
import { getGithubToken } from '$lib/server/prisma/users/service';
import { NeovimPluginManager, type NeovimConfig, type User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { LazyLockSchema } from '../schema';
import { FileContentTraverser } from './FileContentTraverser';
import { findLazyLockNode, findPluginManager } from './plugins/syncer';

export class SyncManager {
  foundPlugins: Set<number> = new Set()
	treeTraverser: FileContentTraverser;
	syncedPluginManager = false;
	constructor(
    token: string,
		private tree: GithubTree,
		public config: NeovimConfig,
		private trackedPlugins: NeovimPluginIdentifier[]
	) {
		this.treeTraverser = new FileContentTraverser(
			token,
			config.owner,
			config.repo,
			tree,
			config.root
		);
	}

	async treeSync() {
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
      this.findPlugins(content)
      this.findLeaderKey(content)
		}
      return await addPlugins(this.config.id, [...this.foundPlugins])
	}

	findPlugins(content: string) {
		for (const plugin of this.trackedPlugins) {
      const { owner, name } = plugin
      const fullName = `${owner}/${name}`;
      if (content.includes(fullName)) {
        this.foundPlugins.add(plugin.id)
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

  // TODO:
	findLeaderKey(content: string): string | undefined {
    for (const line of content.split("\n")) {
      if (line.includes('leader')) {
        const leaderSplit = line.trim().split("=")
        if (leaderSplit.length !== 2) continue
        const leaderKey = leaderSplit[1]
        // TODO: parse out to fix for trailing '<x>' and "<x>"
        console.log({ leaderKey })
        return leaderKey
      }
    }
	}
}

export function simplePluginFinderFactory(
	pluginManager: NeovimPluginManager,
	token: string,
	config: NeovimConfig
): PluginFinder {
	switch (pluginManager) {
		case NeovimPluginManager.Lazy:
			return new LazyLockPluginFinder(token, config);
		case NeovimPluginManager.Packer:
			throw new Error('Not Implemented');
		default:
			throw new Error('Not Implemented');
	}
}

export class LazyLockPluginFinder implements PluginFinder {
	constructor(private token: string, private config: NeovimConfig) {}

	async findPlugins(tree: GithubTree) {
		const sha = this.getLazyLockSha(tree);
		const lazyLock = await this.getLazyLock(sha);
		const pluginNames = Object.keys(lazyLock);
		return pluginNames;
	}

	getLazyLockSha(tree: GithubTree): string {
		const { sha } = findLazyLockNode(this.config.root, tree);
		if (!sha)
			throw new TRPCError({
				message: 'unable to find lazy lock file',
				code: 'INTERNAL_SERVER_ERROR'
			});
		return sha;
	}

	async getLazyLock(sha: string): Promise<LazyLockSchema> {
		const { owner, repo } = this.config;
		const file = await fetchFile(this.token, owner, repo, sha);
		const content = Buffer.from(file.content, 'base64').toString();
		const lazyLock = JSON.parse(content) as unknown;
		return LazyLockSchema.parse(lazyLock);
	}
}

export interface PluginFinder {
	findPlugins(tree: GithubTree): Promise<string[]>;
}

export async function syncManagerFactory(user: User, config: NeovimConfig): Promise<SyncManager> {
	const token = await getGithubToken(user.id);
	const tree = await fetchRepoFileTree(token, config.owner, config.repo, config.branch);
  const trackedPlugins = await getAllNeovimPluginNames()
	return new SyncManager(token, tree, config, trackedPlugins);
}
