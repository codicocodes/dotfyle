jest.mock('$lib/server/prisma/users/service', () => ({ deleteUser: jest.fn() }));
jest.mock('$lib/server/auth/services', () => ({ logout: jest.fn() }));
jest.mock('$lib/utils', () => ({ isAdmin: jest.fn(() => false) }));

import { t } from './t';
import { deleteAccount } from './procedures/deleteAccount';
import { deleteUser } from '$lib/server/prisma/users/service';
import { logout } from '$lib/server/auth/services';
import { isAdmin } from '$lib/utils';
import { makeCaller, mockUser, mockCookies } from './test-utils';

const mockDeleteUser = jest.mocked(deleteUser);
const mockLogout = jest.mocked(logout);
const mockIsAdmin = jest.mocked(isAdmin);

const router = t.router({ deleteAccount });
const createCaller = t.createCallerFactory(router);

beforeEach(() => jest.clearAllMocks());

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
      code: 'UNAUTHORIZED',
    });

    expect(mockDeleteUser).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it('throws FORBIDDEN and skips deletion for admin accounts', async () => {
    mockIsAdmin.mockReturnValue(true);

    await expect(makeCaller(createCaller, mockUser).deleteAccount()).rejects.toMatchObject({
      code: 'FORBIDDEN',
    });

    expect(mockDeleteUser).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
  });
});
