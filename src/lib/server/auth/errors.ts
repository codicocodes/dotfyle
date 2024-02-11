export class JwtSecretError extends Error {
	constructor() {
		super('JWT_ACCESS_SECRET must be configured with a minimum length of 32');
	}
}
