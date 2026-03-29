import { dev } from '$app/environment';
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
    if (!INTERNAL_API_TOKEN) {
      return false;
    }
    return this.event.request.headers.get('Authorization') === INTERNAL_API_TOKEN;
  }

  validateAdmin(user: User | null) {
    if (!user) {
      error(401, 'unauthorized');
    }
    if (!dev) {
      if (!isAdmin(user)) {
        error(403, 'forbidden');
      }
    }
  }
}
