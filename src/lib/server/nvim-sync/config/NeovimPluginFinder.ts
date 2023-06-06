import { fetchFile } from "$lib/server/github/api";
import type { GithubNode, GithubTree } from "$lib/server/github/schema";
import { NeovimPluginManager, type NeovimConfig } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { LazyLockSchema } from "../schema";

export interface NeovimPluginFinder {
	find(tree: GithubTree): Promise<string[]>;
}

export const PackerCompiledPath = "plugin/packer_compiled.lua"

export const LazyLockPath = "lazy-lock.json"

export function getNeovimPluginFinder(
	pluginManager: NeovimPluginManager,
	token: string,
	config: NeovimConfig
): NeovimPluginFinder {
	switch (pluginManager) {
		case NeovimPluginManager.Lazy:
			return new LazyLockPluginFinder(token, config);
		case NeovimPluginManager.Packer:
			throw new Error('Not Implemented');
		default:
			throw new Error('Not Implemented');
	}
}

class LazyLockPluginFinder implements NeovimPluginFinder {
	constructor(private token: string, private config: NeovimConfig) {}

	async find(tree: GithubTree) {
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

export function findPluginManager(tree: GithubTree, config: NeovimConfig): NeovimPluginManager | undefined {
  if (isLazy(config.root, tree)) {
    return NeovimPluginManager.Lazy
  }
  if (isPacker(config.root, tree)) {
    return NeovimPluginManager.Packer
  }
}

export function findLazyLockNode(rootPath: string, root: GithubTree): GithubNode  {
  const expectedPath = rootPath ? `${rootPath}/${LazyLockPath}` : LazyLockPath
  for (const node of root.tree) {
    if (node.path === expectedPath) {
      return node
    }
  }
  throw new TRPCError({ message: 'unable to find lazy lock file', code: "INTERNAL_SERVER_ERROR"})
}

export function isLazy(rootPath: string, root: GithubTree): boolean {
  try {
    findLazyLockNode(rootPath, root)
    return true
  } catch(_err) {
    return false
  }
} 

export function isPacker(rootPath: string, root: GithubTree): boolean {
  const expectedPath = rootPath ? `${rootPath}/${PackerCompiledPath}` : PackerCompiledPath
  for (const node of root.tree) {
    if (node.path === expectedPath) {
      return true
    }
  }
  return false
}
