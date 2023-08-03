// Test cases:
// "https://github.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
// "https://github.com/xiantang/darcula-dark.nvim/blob/main/img/preview.png"
// ="/FrenzyExists/aquarium-vim/raw/develop/screenshots/banner.png"

// TODO: Before merge do more random testing, but this does look like it will work

export class GithubMediaParser {
	replaceInvalidGithubUrls(readme: string): string {
		const invalidGithubLinksRegex =
      /https:\/\/github.com\/[a-zA-Z0-9/\-._]+.(png|jpg|jpeg|mp4|webp)/g
			// /https:\/\/github.com\/[a-zA-Z0-9/]+\/blob\/[a-zA-Z0-9/._]+.(png|jpg|jpeg|mp4|webp)/g;
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

  // TODO: Refactor and add unit tests for this logic (entire class?)
	async findMediaUrls(getSha: () => Promise<string>, readme: string, user: string, repo: string): Promise<string[]> {
		const validGithubLinkRegex =
      // https://user-images.githubusercontent.com/some/repo/what-ever_go/es-here.png
			/https:\/\/(raw|user-images).githubusercontent.com\/[a-zA-Z0-9/]+\/[a-zA-Z0-9/\-._]+.(png|jpg|jpeg|mp4|gif)/g;

		const validGithubLinkMatches = readme.matchAll(validGithubLinkRegex);

		const allMedia = [];

		for (const validGithubLinkMatch of validGithubLinkMatches) {
			const media = validGithubLinkMatch[0];
			allMedia.push(media);
		}

    // ![](/preview.png) < - stored locally in repository
		const storedInRepoRelativeMarkdownRegex = /\([/a-zA-Z-_]+.(jpe?g|png|gif|bmp)\)/g;

    const relativeMatches = readme.matchAll(storedInRepoRelativeMarkdownRegex)

    let sha: string | undefined = undefined;
		for (const relativeMatch of relativeMatches) {
      if (!sha) {
        sha = await getSha()
      }
      const relativeMedia = relativeMatch[0].replace("(", "").replace(")", "")
      const relativeMediaUrl = `https://raw.githubusercontent.com/${user}/${repo}/${sha}${relativeMedia.startsWith("/") ? relativeMedia : "/".concat(relativeMedia)}`
      allMedia.push(relativeMediaUrl)
		}

    // explains itself
		const githubAssetRegex = new RegExp(
			`https://github.com/${user}/${repo}/assets/[0-9]+/[a-zA-Z0-9-]+`,
			'g'
		);

		for (const validAssetUrlMatches of readme.matchAll(githubAssetRegex)) {
			const asset = validAssetUrlMatches[0];
			allMedia.push(asset);
		}
		return allMedia;
	}
}
