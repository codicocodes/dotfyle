import type { User } from '@prisma/client';
import { JWT_ACCESS_SECRET, NODE_ENV } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { JwtSecretError } from './errors';
import { redirect, type Cookies } from '@sveltejs/kit';
import { UserSchema } from '$lib/prisma/users/schema';
import type { RequestEvent } from '../../routes/$types';

export function getJwtAccessSecret(): string {
	if (JWT_ACCESS_SECRET.length < 32) {
		throw new JwtSecretError();
	}
	return JWT_ACCESS_SECRET;
}

export function createSignedJwtToken(user: User) {
	const secret = getJwtAccessSecret();
	const token = jwt.sign(user, secret, {
		expiresIn: '1d'
	});
	return token;
}

export const COOKIE_NAME = 'DotfilezzToken';

export function createCookie(cookies: Cookies, token: string, maxAge: number = 60 * 60 * 24) {
	cookies.delete(COOKIE_NAME);
	cookies.set(COOKIE_NAME, token, {
		httpOnly: true,
		path: '/',
		secure: NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge, 
	});
  return cookies.get(COOKIE_NAME) as string
}

export function verifyToken(cookies: Cookies): User | null {
	const cookie = cookies.get(COOKIE_NAME);
	if (!cookie) return null;
	const jwtData = jwt.verify(cookie, getJwtAccessSecret());
	try {
		return UserSchema.parse(jwtData);
	} catch (err) {
    console.error(err)
		return null;
	}
}

export async function login(c: Cookies, u: User): Promise<never> {
	const token = createSignedJwtToken(u);
	createCookie(c, token);
	throw redirect(302, '/');
}

export function logout(cookies: Cookies): string {
  const cookie = createCookie(cookies, "", 0)
  return cookie
}
