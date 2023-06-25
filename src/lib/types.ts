import type { BreakingChange, NeovimPlugin, Post } from '@prisma/client';

export type JsonPlugin = Omit<NeovimPlugin, 'createdAt' | 'lastSyncedAt'> & {
	createdAt: string;
	lastSyncedAt: string | null;
};

export type JsonBreakingChange = BreakingChange & {
	plugin: JsonPlugin;
};

export type JsonPostContainer = Omit<Post, 'createdAt'> & {
	createdAt: string;
	breakingChange: JsonBreakingChange | null;
};

export type JsonBreakingChangePost = Omit<JsonPostContainer, 'breakingChange'> & {
	breakingChange: JsonBreakingChange;
};

export interface NeovimConfig {
	stars: number;
	owner: string;
	ownerAvatar: string;
	name: string;
	language: string;
	plugins: number;
	pluginManager: string;
	fork: boolean;
	initFile: string;
	path: string;
	root: string;
}
