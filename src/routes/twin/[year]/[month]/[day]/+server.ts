import { error, redirect, type RequestHandler } from '@sveltejs/kit';

const proxy = {
	'2023/Jun/12': 46,
	'2023/Jun/07': 45,
	'2023/Jun/7': 45,
	'2023/May/29': 44,
	'2023/May/23': 43,
	'2023/May/15': 42,
	'2023/May/08': 41,
	'2023/May/8': 41,
	'2023/Apr/17': 40,
	'2023/Apr/10': 39,
	'2023/Apr/03': 38,
	'2023/Apr/3': 38,
	'2023/Mar/27': 37,
	'2023/Mar/20': 36,
	'2023/Mar/14': 35,
	'2023/Mar/06': 34,
	'2023/Mar/6': 34,
	'2023/Feb/27': 33,
	'2023/Feb/20': 32,
	'2023/Feb/13': 31,
	'2023/Feb/06': 30,
	'2023/Feb/6': 30,
	'2023/Jan/30': 29,
	'2023/Jan/23': 28,
	'2023/Jan/16': 27,
	'2023/Jan/09': 26,
	'2023/Jan/9': 26,
	'2023/Jan/02': 25,
	'2023/Jan/2': 25,
	'2022/Dec/26': 24,
	'2022/Dec/19': 23,
	'2022/Dec/12': 22,
	'2022/Dec/05': 21,
	'2022/Dec/5': 21,
	'2022/Nov/28': 20,
	'2022/Nov/21': 19,
	'2022/Nov/14': 18,
	'2022/Nov/07': 17,
	'2022/Nov/7': 17,
	'2022/Oct/31': 16,
	'2022/Oct/24': 15,
	'2022/Oct/17': 14,
	'2022/Oct/10': 13,
	'2022/Oct/03': 12,
	'2022/Oct/3': 12,
	'2022/Sep/26': 11,
	'2022/Sep/19': 10,
	'2022/Sep/12': 9,
	'2022/Sep/05': 8,
	'2022/Sep/5': 8,
	'2022/Aug/29': 7,
	'2022/Aug/22': 6,
	'2022/Aug/15': 5,
	'2022/Aug/08': 4,
	'2022/Aug/8': 4,
	'2022/Aug/01': 3,
	'2022/Aug/1': 3,
	'2022/Jul/25': 2,
	'2022/Jul/15': 1
} as Record<string, number>;

export const GET: RequestHandler = (event) => {
	const { year, month, day } = event.params;
	const id = `${year}/${month}/${day}`;
	const issue = proxy[id];
	if (!issue) {
		throw error(404);
	}
	throw redirect(302, `/this-week-in-neovim/${issue}`);
};
