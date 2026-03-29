import { vi, beforeEach } from 'vitest';

vi.mock('$lib/server/prisma/users/service', () => ({ deleteUser: vi.fn() }));
vi.mock('$lib/server/auth/services', () => ({ logout: vi.fn() }));
vi.mock('$lib/utils', () => ({ isAdmin: vi.fn(() => false) }));

import { t } from '../../t';
import { deleteAccount } from '../deleteAccount';
import { deleteUser } from '$lib/server/prisma/users/service';
import { logout } from '$lib/server/auth/services';
import { isAdmin } from '$lib/utils';
import { makeCaller, mockUser, mockCookies } from '../../test-utils';

const mockDeleteUser = vi.mocked(deleteUser);
const mockLogout = vi.mocked(logout);
const mockIsAdmin = vi.mocked(isAdmin);

const router = t.router({ deleteAccount });
const createCaller = t.createCallerFactory(router);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('deleteAccount', () => {
  it('deletes the authenticated user and clears the session', async () => {
    await makeCaller(createCaller, mockUser).deleteAccount();

    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
    expect(mockDeleteUser).toHaveBeenCalledWith(mockUser.id);
    expect(mockLogout).toHaveBeenCalledWith(mockCookies);
  });

  it('can only delete the authenticated user — no input means no other target is possible', async () => {
    const anotherUser = { ...mockUser, id: 999, username: 'anotheruser' };

    await makeCaller(createCaller, anotherUser).deleteAccount();

    expect(mockDeleteUser).toHaveBeenCalledWith(anotherUser.id);
    expect(mockDeleteUser).not.toHaveBeenCalledWith(mockUser.id);
    expect(mockLogout).toHaveBeenCalledWith(mockCookies);
  });

  it('throws UNAUTHORIZED and skips deletion when not authenticated', async () => {
    await expect(makeCaller(createCaller, null).deleteAccount()).rejects.toMatchObject({
      code: 'UNAUTHORIZED'
    });

    expect(mockDeleteUser).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('throws FORBIDDEN and skips deletion for admin accounts', async () => {
    mockIsAdmin.mockReturnValue(true);

    await expect(makeCaller(createCaller, mockUser).deleteAccount()).rejects.toMatchObject({
      code: 'FORBIDDEN'
    });

    expect(mockDeleteUser).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
