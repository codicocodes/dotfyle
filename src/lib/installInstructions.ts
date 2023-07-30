import type { NeovimConfig } from "@prisma/client";

export function getInstallCommand(config: NeovimConfig) {
  const configPath = `${config.owner}/${config.repo}`
  const installCommands: Record<string, string> = {
    lazy: `NVIM_APPNAME=${configPath}/${config.root} nvim --headless +"Lazy! sync" +qa`,
    packer: `NVIM_APPNAME=${configPath}/${config.root} nvim --headless +"PackerSync" +qa`
  };
  const cloneCommand = `git clone git@github.com:${config.owner}/${config.repo} ~/.config/${config.owner}/${config.repo}`
  return [cloneCommand, installCommands[config.pluginManager?.toLowerCase() ?? ""]].join("\n").trim()
}

export function getRunCommand(config: NeovimConfig) {
  return `NVIM_APPNAME=${config.owner}/${config.repo}/${config.root} nvim`
}
