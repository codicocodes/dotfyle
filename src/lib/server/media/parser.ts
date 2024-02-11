export class GithubMediaParser {
	replaceInvalidGithubUrls(readme: string, owner: string, repo: string): string {
		const wikiPageRegex = new RegExp(
			`https://github.com/${owner}/${repo}/wiki/[a-zA-Z0-9./_-]+.(png|jpg|jpeg|mp4|webp|gif)`,
			'g'
		);
		const wikiPagesMatches = readme.matchAll(wikiPageRegex);
		for (const wikiPageMatch of wikiPagesMatches) {
			const wikiPageLink = wikiPageMatch[0];
			const validWikiPageLink = wikiPageLink
				.replace('/wiki/', '/')
				.replace('github.com', 'raw.githubusercontent.com/wiki');
			readme = readme.replaceAll(wikiPageLink, validWikiPageLink);
		}
		const invalidGithubLinksRegex =
			/https:\/\/github.com\/[a-zA-Z0-9./_-]+.(png|jpg|jpeg|mp4|webp|gif)/g;
		const invalidGithubLinkMatches = readme.matchAll(invalidGithubLinksRegex);
		for (const invalidGithubLinkMatch of invalidGithubLinkMatches) {
			const invalidGithubLink = invalidGithubLinkMatch[0];
			const validGithubLink = invalidGithubLink
				.replace('github.com', 'raw.githubusercontent.com')
				.replace('/blob', '');
			readme = readme.replaceAll(invalidGithubLink, validGithubLink);
		}
		return readme;
	}

	findMediaUrls(readme: string, user: string, repo: string, branch: string): string[] {
		const validGithubLinkRegex =
			/https:\/\/(raw|user-images).githubusercontent.com\/[a-zA-Z0-9/]+\/[a-zA-Z0-9/\-._]+.(png|jpg|jpeg|mp4|gif)/g;

		const validGithubLinkMatches = readme.matchAll(validGithubLinkRegex);

		const allMedia = [];

		for (const validGithubLinkMatch of validGithubLinkMatches) {
			const media = validGithubLinkMatch[0];
			allMedia.push(media);
		}

		const githubAssetRegex = new RegExp(
			`https://github.com/${user}/${repo}/assets/[0-9]+/[a-zA-Z0-9-]+`,
			'g'
		);

		for (const validAssetUrlMatches of readme.matchAll(githubAssetRegex)) {
			const asset = validAssetUrlMatches[0];
			allMedia.push(asset);
		}

		const storedInRepoRelativeMarkdownRegex = /\(.[/a-zA-Z-_]+.(png|jpg|jpeg|mp4|gif|svg)\)/g;

		const relativeMarkdownMatches = readme.matchAll(storedInRepoRelativeMarkdownRegex);

		for (const relativeMatch of relativeMarkdownMatches) {
			if (relativeMatch[0].startsWith('(./')) {
				relativeMatch[0] = relativeMatch[0].replace('./', '/');
			}
			const relativeMedia = relativeMatch[0].replace('(', '').replace(')', '');
			const relativeMediaUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}${
				relativeMedia.startsWith('/') ? relativeMedia : '/'.concat(relativeMedia)
			}`;
			allMedia.push(relativeMediaUrl);
		}

		const storedInRepoRelativeHtmlRegex =
			/<img src=('|")([.][/])?[a-zA-Z-_/]+.(png|jpg|jpeg|mp4|gif|svg)('|")/g;

		const relativeHtmlMatches = readme.matchAll(storedInRepoRelativeHtmlRegex);

		for (const relativeMatch of relativeHtmlMatches) {
			let relativeMedia = relativeMatch[0]
				.replace('<img src=', '')
				.replaceAll('"', '')
				.replaceAll("'", '');
			if (relativeMedia.startsWith('./')) {
				relativeMedia = relativeMedia.replace('./', '/');
			}
			const relativeMediaUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}${
				relativeMedia.startsWith('/') ? relativeMedia : '/'.concat(relativeMedia)
			}`;
			allMedia.push(relativeMediaUrl);
		}

		return allMedia;
	}
}
