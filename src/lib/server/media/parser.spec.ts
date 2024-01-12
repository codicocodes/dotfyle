import { GithubMediaParser } from "./parser";

describe("GithubMediaParser.findMediaUrls()", () => {
	const parser = new GithubMediaParser()
	it("can parse something", () => {
		const urls = parser.findMediaUrls("", "", "")
		expect(urls).toEqual([])
	})
})
