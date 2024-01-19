import { fetchFile } from '$lib/server/github/api';
import type { GithubNode, GithubTree } from '$lib/server/github/schema';

export class GithubFileContentTraverser {
	private nodeQueue: { sha: string; path: string }[];
	constructor(
		private token: string,
		private owner: string,
		private repo: string,
		githubRoot: GithubTree,
		configRoot: string
	) {
		this.nodeQueue = githubRoot.tree
			.filter((n) => Boolean(n.path))
			.filter((n) => Boolean(n.sha))
			.filter((n) => n.type === 'blob')
			.filter((n) => n.path?.startsWith(configRoot ? configRoot.concat('/') : ''))
			.filter(
				(n) =>
					n.path?.endsWith('.lua') ||
					n.path?.endsWith('.fnl') ||
					n.path?.endsWith('.vim') ||
					n.path?.endsWith('.vimrc')
			)
			.map(({ sha, path, url }) => ({
				sha,
				path,
				url,
			})) as { sha: string; path: string }[];
	}

	async *traverse() {
		for await (const {path, sha} of this.nodeQueue) {
			yield {
				path,
				content: await this.getContent(sha)
			};
		}
	}

	async getContent(sha: string) {
		const file = await fetchFile(this.token, this.owner, this.repo, sha);
		const content = Buffer.from(file.content, 'base64').toString();
		return content;
	}
}
