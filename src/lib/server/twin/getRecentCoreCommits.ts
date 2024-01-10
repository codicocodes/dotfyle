import { z } from "zod";

export interface NeovimCoreCommit {
	title: string;
	url: string;
}

export const NeovimCoreCommit = z.object({
	title: z.string(),
	body: z.string(),
	url: z.string(),
	date: z.date(),
});

export type NeovimCoreCommitType = z.infer<typeof NeovimCoreCommit>;

const fetchCommits = async () => {
	const URL = "https://github.com/neovim/neovim/commits/master/runtime/doc/news.txt.atom"
	const json = await fetch(URL).then(r => r.json())
	return json
}


export const getRecentCoreCommits = async () => {
	const json = await fetchCommits()
	const commits: NeovimCoreCommitType[] = []
	for (const commitGroup of json.payload.commitGroups) {
		const rawCommit = commitGroup.commits[0]
		const url = `https://github.com/neovim/neovim/commit/${rawCommit.oid}/`
		const commit: unknown = {
			title: rawCommit.shortMessage,
			body: rawCommit.bodyMessageHtml,
			url,
			date: new Date(rawCommit.committedDate),
		}
		commits.push(NeovimCoreCommit.parse(commit))
	}
	return commits
}
