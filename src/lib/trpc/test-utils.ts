import { TRPCError } from '@trpc/server';
import type { Context } from './context';

type User = Context['user'];

export const mockCookies = {};

export const mockUser = {
  id: 1,
  githubId: 12345,
  username: 'testuser',
  avatarUrl: 'https://example.com/avatar.png',
  createdAt: new Date()
};

export function makeContext(user: User): Context {
  return {
    user,
    event: { cookies: mockCookies } as Context['event'],
    getAuthenticatedUser() {
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return user;
    }
  };
}

export function makeCaller<T>(createCaller: (ctx: Context) => T, user: User) {
  return createCaller(makeContext(user));
}
