import { NODE_ENV } from '$env/static/private';
import { verifyToken } from '$lib/server/auth/services';
import { upsertManyNeovimPlugins } from '$lib/server/prisma/neovimplugins/service';
import { scrapeRockerBooAwesomeNeovim } from '$lib/server/seeder/plugins';
import { isAdmin } from '$lib/utils';
import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { INTERNAL_API_TOKEN } from '$env/static/private';
import type { User } from '@prisma/client';

class RequestValidator {
	event: RequestEvent;
	constructor(event: RequestEvent) {
		this.event = event;
	}

	validate() {
		if (this.isInternalAPI()) {
			return;
		}
		const user = verifyToken(this.event.cookies);
    this.validateAdmin(user)
	}

	isInternalAPI(): boolean {
		if (!INTERNAL_API_TOKEN) {
			return false;
		}
		return this.event.request.headers.get('Authorization') === INTERNAL_API_TOKEN;
	}

	validateAdmin(user: User | null) {
		if (!user) {
			throw error(401, 'unauthorized');
		}
		if (NODE_ENV === 'production') {
			if (!isAdmin(user)) {
				throw error(403, 'forbidden');
			}
		}
	}
}

export const GET: RequestHandler = async function (event: RequestEvent) {
	new RequestValidator(event).validate()
	const plugins = await scrapeRockerBooAwesomeNeovim();
	const saved = await upsertManyNeovimPlugins(plugins);
	const res = new Response(JSON.stringify(saved, undefined, 4));
	return res;
};
