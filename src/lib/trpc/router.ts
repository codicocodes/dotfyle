import { t } from './t';
import { generateTwinIssue } from './procedures/generateTwinIssue';
import { updateTwinIssue } from './procedures/updateTwinIssue';
import { publishTwinIssue } from './procedures/publishTwinIssue';
import { getLatestTwinIssue } from './procedures/public/getLatestTwinIssue';
import { syncPlugin } from './procedures/syncPlugin';
import { deleteConfig } from './procedures/deleteConfig';
import { getRepositories } from './procedures/getRepositories';
import { syncExistingNeovimConfig } from './procedures/syncExistingNeovimConfig';
import { createNeovimConfig } from './procedures/createNeovimConfig';
import { findRepoInitFiles } from './procedures/findRepoInitFiles';
import { getGitHubRepository } from './procedures/getGitHubRepository';
import { createNeovimPlugin } from './procedures/createNeovimPlugin';
import { deleteMedia } from './procedures/deleteMedia';
import { toggleThumbnail } from './procedures/toggleThumbnail';
import { generatePluginDescription } from './procedures/generatePluginDescription';
import { savePluginDescription } from './procedures/savePluginDescription';
import { generateInstallInstructions } from './procedures/generateInstallInstructions';
import { saveInstallInstructions } from './procedures/saveInstallInstructions';
import { deleteAccount } from './procedures/deleteAccount';
import { getPluginsByCategory } from './procedures/public/getPluginsByCategory';
import { getPopularPlugins } from './procedures/public/getPopularPlugins';
import { listPluginCategories } from './procedures/public/listPluginCategories';
import { listLanguageServers } from './procedures/public/listLanguageServers';
import { recentPluginsWithDotfyleShields } from './procedures/public/recentPluginsWithDotfyleShields';
import { recentConfigsWithDotfyleShields } from './procedures/public/recentConfigsWithDotfyleShields';
import { searchPlugins } from './procedures/public/searchPlugins';
import { searchPluginsWithMedia } from './procedures/public/searchPluginsWithMedia';
import { getConfigsForPlugin } from './procedures/public/getConfigsForPlugin';
import { getPlugin } from './procedures/public/getPlugin';
import { getLanguageServersBySlug } from './procedures/public/getLanguageServersBySlug';
import { getPluginsBySlug } from './procedures/public/getPluginsBySlug';
import { getConfigBySlug } from './procedures/public/getConfigBySlug';
import { getConfigsByUsername } from './procedures/public/getConfigsByUsername';
import { getAuthoredPluginsByUsername } from './procedures/public/getAuthoredPluginsByUsername';
import { getUserByUsername } from './procedures/public/getUserByUsername';
import { getUser } from './procedures/public/getUser';
import { getNewestConfigs } from './procedures/public/getNewestConfigs';
import { searchConfigs } from './procedures/public/searchConfigs';
import { getPluginIdentifiers } from './procedures/public/getPluginIdentifiers';
import { getPosts } from './procedures/public/getPosts';
import { getTwinPosts } from './procedures/public/getTwinPosts';
import { getTwinByIssue } from './procedures/public/getTwinByIssue';
import { getBreakingCommits } from './procedures/public/getBreakingCommits';
import { getMediaForPlugin } from './procedures/public/getMediaForPlugin';
import { getInstallInstructions } from './procedures/public/getInstallInstructions';
import { getDotfyleStatisitics } from './procedures/public/getDotfyleStatisitics';

export const router = t.router({
  syncPlugin,
  deleteConfig,
  getPluginsByCategory,
  getPopularPlugins,
  listPluginCategories,
  listLanguageServers,
  recentPluginsWithDotfyleShields,
  recentConfigsWithDotfyleShields,
  searchPlugins,
  searchPluginsWithMedia,
  getConfigsForPlugin,
  getPlugin,
  getLanguageServersBySlug,
  getPluginsBySlug,
  getConfigBySlug,
  getConfigsByUsername,
  getAuthoredPluginsByUsername,
  getUserByUsername,
  getUser,
  getRepositories,
  getNewestConfigs,
  searchConfigs,
  getPluginIdentifiers,
  syncExistingNeovimConfig,
  createNeovimConfig,
  findRepoInitFiles,
  getPosts,
  getTwinPosts,
  getTwinByIssue,
  getBreakingCommits,
  getMediaForPlugin,
  generateTwinIssue,
  updateTwinIssue,
  publishTwinIssue,
  getLatestTwinIssue,
  getGitHubRepository,
  createNeovimPlugin,
  deleteMedia,
  toggleThumbnail,
  generatePluginDescription,
  savePluginDescription,
  generateInstallInstructions,
  saveInstallInstructions,
  getInstallInstructions,
  deleteAccount,
  getDotfyleStatisitics
});

export type Router = typeof router;
