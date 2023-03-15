import type { GithubNode, GithubTree } from "$lib/github/schema";
import { NeovimPluginManager, type NeovimConfig } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export function findPluginManager(tree: GithubTree, config: NeovimConfig): NeovimPluginManager | undefined {
  if (isLazy(config.root, tree)) {
    return NeovimPluginManager.Lazy
  }
  if (isPacker(config.root, tree)) {
    return NeovimPluginManager.Packer
  }
}

export const LazyLockPath = "lazy-lock.json"

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

export const PackerCompiledPath = "plugin/packer_compiled.lua"

export function isPacker(rootPath: string, root: GithubTree): boolean {
  const expectedPath = rootPath ? `${rootPath}/${PackerCompiledPath}` : PackerCompiledPath
  for (const node of root.tree) {
    if (node.path === expectedPath) {
      return true
    }
  }
  return false
}
