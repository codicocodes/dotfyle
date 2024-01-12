import { GithubMediaParser } from './parser';

describe('GithubMediaParser.findMediaUrls()', () => {
	const parser = new GithubMediaParser();

	function run(readme: string, username = '', reponame = '', branchname = '') {
		readme = parser.replaceInvalidGithubUrls(readme);
		return parser.findMediaUrls(readme, username, reponame, branchname);
	}

	it('matches absolute raw blob url', () => {
		const input = 'https://github.com/echasnovski/mini.nvim/blob/main/logo.gif';
		const output = 'https://raw.githubusercontent.com/echasnovski/mini.nvim/main/logo.gif';
		const media = run(input);
		expect(media[0]).toEqual(output);
	});
	it('matches absolute raw githubusercontent gif', () => {
		const url = 'https://raw.githubusercontent.com/sahlte/timed-highlight.nvim/main/doc/demo.gif';
		const media = run(url);
		expect(media[0]).toEqual(url);
	});
	it('matches absolute user-images githubusercontent png with asset id', () => {
		const url =
			'https://user-images.githubusercontent.com/506791/144542071-1aa66f81-b07c-492e-9884-fdafed1006df.png';
		const media = run(url);
		expect(media[0]).toEqual(url);
	});
	it('matches absolute assets url', () => {
		const url =
			'https://github.com/pianocomposer321/officer.nvim/assets/54072354/d0d49fd0-1b23-4936-aec1-80459bd2ef5e';
		const media = run(url, "pianocomposer321", "officer.nvim");
		expect(media[0]).toEqual(url);
	});
	it('matches absolute {username}/media/raw/{branch}/{repo} png', () => {
		const url = "https://github.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const output = "https://raw.githubusercontent.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const media = run(url, "echasnovski", "mini.nvim");
		expect(media[0]).toEqual(output);
	})
	it('matches absolute {username}/{repo}/blob/{branch}/ png', () => {
		const url = "https://github.com/xiantang/darcula-dark.nvim/blob/main/img/preview.png"
		const output = "https://raw.githubusercontent.com/xiantang/darcula-dark.nvim/main/img/preview.png"
		const media = run(url, "xiantang", "darcula-dark.nvim");
		expect(media[0]).toEqual(output);
	})
	it('matches relative markdown image in repository', () => {
		const url = '![some description](/screenshot.png)'
		const output = "https://raw.githubusercontent.com/FrenzyExists/aquarium-vim/develop/screenshot.png"
		const media = run(url, "FrenzyExists", "aquarium-vim", "develop");
		expect(media[0]).toEqual(output);
	})
	it('matches relative markdown image in repository without starting /', () => {
		const url = '![some description](screenshot.png)'
		const output = "https://raw.githubusercontent.com/FrenzyExists/aquarium-vim/develop/screenshot.png"
		const media = run(url, "FrenzyExists", "aquarium-vim", "develop");
		expect(media[0]).toEqual(output);
	})
	it('matches relative markdown image in folder', () => {
		const url = '![some description](/banners/screenshot.png)'
		const output = "https://raw.githubusercontent.com/FrenzyExists/aquarium-vim/develop/banners/screenshot.png"
		const media = run(url, "FrenzyExists", "aquarium-vim", "develop");
		expect(media[0]).toEqual(output);
	})
	it('does not matches absolute url in markdown twice', () => {
		const url = "https://github.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const md = `![some description]("${url}")`
		const output = "https://raw.githubusercontent.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const media = run(md, "echasnovski", "mini.nvim", "main");
		expect(media[0]).toEqual(output);
		expect(media.length).toBe(1);
	})
	it('matches relative html image in repository', () => {
		const url = '<img src="/screenshots/banner.png" />'
		const output = "https://raw.githubusercontent.com/FrenzyExists/aquarium-vim/develop/screenshots/banner.png"
		const media = run(url, "FrenzyExists", "aquarium-vim", "develop");
		expect(media[0]).toEqual(output);
	})
	it('does not matches absolute url in html twice', () => {
		const url = "https://github.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const html = `<img src="${url}" />`
		const output = "https://raw.githubusercontent.com/echasnovski/media/raw/main/mini.nvim/logo/logo_clue.png"
		const media = run(html, "echasnovski", "mini.nvim", "main");
		expect(media[0]).toEqual(output);
		expect(media.length).toBe(1);
	})
	// TODO: Fix this failing test
	it.skip('matches absolute github url with "-" in owner name', () => {
		const md = "![fidget.nvim demo](https://github.com/j-hui/fidget.nvim/blob/media/gifs/fidget-demo-rust-analyzer.gif?raw=true)"
		const output = "https://raw.githubusercontent.com/j-hui/fidget.nvim/media/gifs/fidget-demo-rust-analyzer.gif"
		const media = run(md, "j-hui", "fidget.nvim", "main");
		expect(media[0]).toEqual(output);
		expect(media.length).toBe(1);
	})

	it("matches camo link", () => {
		const url = "https://camo.githubusercontent.com/8a9838bf08b4936eb9df3fa71ea863bb5c5143a9e83b8e54296aae6f91fe60b9/68747470733a2f2f7668732e636861726d2e73682f7668732d357a6a6f4c516f4b4a4b4b314451426c6433525152702e676966"
		const media = run(url, "username", "reponame", "main");
		expect(media[0]).toEqual(url);
	})
});

