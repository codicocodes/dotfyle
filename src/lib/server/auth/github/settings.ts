import { GITHUB_ID, GITHUB_SECRET, NODE_ENV } from '$env/static/private';

export const BASE_URL = NODE_ENV === 'production' ? 'https://dotfyle.com' : 'http://localhost:5173';

export const GITHUB_CALLBACK_URL = `${BASE_URL}/api/auth/github/callback`;

export const GITHUB_REDIRECT_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=read:user&redirect_uri=${GITHUB_CALLBACK_URL}`;

export const GITHUB_ACCESS_TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_ID}&client_secret=${GITHUB_SECRET}&code={{code}}`;
