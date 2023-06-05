import { NODE_ENV } from '$env/static/private';
import { verifyToken } from '$lib/server/auth/services';
import { isAdmin } from '$lib/utils';
import { error, type RequestEvent } from '@sveltejs/kit';
import { INTERNAL_API_TOKEN } from '$env/static/private';
import type { User } from '@prisma/client';

export class AdminRequestValidator {
	event: RequestEvent;
	constructor(event: RequestEvent) {
		this.event = event;
	}

	validate() {
		if (this.isInternalAPI()) {
			return;
		}
		const user = verifyToken(this.event.cookies);
		this.validateAdmin(user);
	}

	isInternalAPI(): boolean {
		console.log('isInternalAPI', {
			header: this.event.request.headers.get('Authorization'),
			INTERNAL_API_TOKEN
		});
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
