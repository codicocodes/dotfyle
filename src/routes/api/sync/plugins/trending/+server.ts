import { createAsyncTaskApi } from '$lib/server/api/bulkApi';
import { syncWeeklyTrending } from '$lib/server/prisma/neovimplugins/service';
import type { RequestHandler } from '@sveltejs/kit';

const getSyncTasks = async () => {
	return [
		async () => {
			await syncWeeklyTrending();
		}
	];
};

export const GET: RequestHandler = createAsyncTaskApi(getSyncTasks);
