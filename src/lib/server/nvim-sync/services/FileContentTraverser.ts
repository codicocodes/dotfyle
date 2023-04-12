import { fetchFile } from "$lib/server/github/api";
import type { GithubTree } from "$lib/server/github/schema";

export class FileContentTraverser {
	private shaQueue: string[];
	constructor(
		private token: string,
		private owner: string,
		private repo: string,
		githubRoot: GithubTree,
		configRoot: string
	) {
		this.shaQueue = githubRoot.tree
			.filter((n) => Boolean(n.path))
			.filter((n) => Boolean(n.sha))
			.filter((n) => n.type === "blob")
			.filter((n) => n.path?.startsWith(configRoot ? configRoot.concat("/") : ""))
			.filter((n) => n.path?.endsWith(".lua") || n.path?.endsWith(".fnl") || n.path?.endsWith(".vim") || n.path?.endsWith(".vimrc"))
			.map((n) => n.sha) as string[];
	}

	async *traverse(): AsyncGenerator<string, void, unknown>  {
		for await (const sha of this.shaQueue) {
			yield await this.getContent(sha);
		}
	}

	async getContent(sha: string): Promise<string> {
		const file = await fetchFile(this.token, this.owner, this.repo, sha);
		const content = Buffer.from(file.content, 'base64').toString();
		return content;
	}
}
