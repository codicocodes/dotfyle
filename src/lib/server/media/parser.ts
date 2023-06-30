export class GithubMediaParser {
	replaceInvalidGithubUrls(readme: string): string {
		const invalidGithubLinksRegex =
			/https:\/\/github.com\/[a-zA-Z0-9/]+\/blob\/[a-zA-Z0-9/._]+.(png|jpg|jpeg|mp4|webp)/g;
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

	findMediaUrls(readme: string, user: string, repo: string): string[] {
		const validGithubLinkRegex =
			/https:\/\/(raw|user-images).githubusercontent.com\/[a-zA-Z0-9/]+\/[a-zA-Z0-9/\-._]+.(png|jpg|jpeg|mp4|gif)/g;

		const validGithubLinkMatches = readme.matchAll(validGithubLinkRegex);

    const allMedia = []

		for (const validGithubLinkMatch of validGithubLinkMatches) {
			const media = validGithubLinkMatch[0];
      allMedia.push(media)
		}

		const githubAssetRegex = new RegExp(
			`https://github.com/${user}/${repo}/assets/[0-9]+/[a-zA-Z0-9-]+`,
			'g'
		);

		for (const validAssetUrlMatches of readme.matchAll(githubAssetRegex)) {
			const asset = validAssetUrlMatches[0];
      allMedia.push(asset)
		}
    return allMedia
	}
}
