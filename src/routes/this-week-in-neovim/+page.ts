const posts = [
	{
		id: 'asdf',
		date: new Date('19 Jun 2023').toString(),
		title: '#46',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('12 Jun 2023').toString(),
		title: '#45',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('23 May 2023').toString(),
		title: '#44',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('20 May 2023').toString(),
		title: '#43',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('13 May 2023').toString(),
		title: '#42',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('6 May 2023').toString(),
		title: '#41',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('30 April 2023').toString(),
		title: '#40',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('23 April 2023').toString(),
		title: '#39',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('16 April 2023').toString(),
		title: '#38',
		license: 'CC-BY-SA',
	},
	{
		id: 'asdf',
		date: new Date('9 April 2023').toString(),
		title: '#37',
		license: 'CC-BY-SA',
	},
];

export const load: PageLoad = async function load(event: PageLoadEvent) {
	return {
    posts,
  };
};
