import { getRepoFileTree } from '$lib/repositories/github/services';
import type { User } from '@prisma/client';
import { InitFileFinder } from './init-file-finder';

export class NvimGithubSyncManager {
	initFileFinder: InitFileFinder;
	constructor(private user: User) {
		this.initFileFinder = new InitFileFinder();
	}

	async sync(repo: string) {
    console.log(1, this.user)
		const tree = await getRepoFileTree(this.user, repo);
    console.log(2)
		const initFile = this.initFileFinder.findInitFile(tree);
    console.log(3)
		return initFile;
	}
}
