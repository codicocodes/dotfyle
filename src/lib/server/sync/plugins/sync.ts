import { fetchGithubRepositoryByName, fetchReadme } from "$lib/server/github/api";
import { getGithubRepositories } from "$lib/server/github/services";
import type { NeovimPluginWithCount } from "$lib/server/prisma/neovimplugins/schema";
import { getPlugin, updatePlugin } from "$lib/server/prisma/neovimplugins/service";
import { getGithubToken } from "$lib/server/prisma/users/service";
import { fetchAwesomeNeovimReadme } from "$lib/server/seeder/plugins";
import type { NeovimPlugin } from "@prisma/client";

export class PluginSyncer {
  plugin: NeovimPlugin
  configCount: number
  constructor(private token: string, { configCount, ...plugin}: NeovimPluginWithCount) {
    this.plugin = plugin;
    this.configCount = configCount;
  }
  async sync() {
    await this.syncStars()
    await this.syncReadme()
    return this.updatePlugin()
  }

  async syncStars() {
    const repo = await fetchGithubRepositoryByName(this.token, this.plugin.owner, this.plugin.name)
    this.plugin.stars = repo.stargazers_count
  }

  async syncReadme() {
    const readme = await fetchReadme(this.token, this.plugin.owner, this.plugin.name)
    this.plugin.readme = readme
  }

  async updatePlugin() {
    this.plugin.lastSyncedAt = new Date()
    await updatePlugin(this.plugin)
    return {
      configCount: this.configCount,
      ...this.plugin,
    }
  }
}

export async function getPluginSyncer(userId: number, owner: string, name: string): Promise<PluginSyncer> {
  const token = await getGithubToken(userId)
  const plugin = await getPlugin(owner, name)
  return new PluginSyncer(token, plugin);
}
