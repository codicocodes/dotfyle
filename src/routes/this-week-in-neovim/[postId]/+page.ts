const content = ``

export const load: PageLoad = async function load(event: PageLoadEvent) {
	return {
    id: "asdf",
    date: new Date("12 Jun 2023").toString(),
    title: "12 Jun 2023 #46",
    license: "CC-BY-SA",
		content,
	};
};
