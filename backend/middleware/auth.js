'use strict';

const { jwtVerify, SignJWT } = require('jose');

/**
 * Create JWT tokens
 */
async function createTokens(user, config) {
	const secret = new TextEncoder().encode(config.jwtSecret);
	const refreshSecret = new TextEncoder().encode(config.jwtRefreshSecret);

	const payload = {
		sub: user._id.toString(),
		email: user.email,
		plan: user.plan
	};

	// Access token (short-lived)
	const accessToken = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(config.jwtExpiresIn || '15m')
		.sign(secret);

	// Refresh token (long-lived)
	const refreshToken = await new SignJWT({ sub: user._id.toString() })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(config.jwtRefreshExpiresIn || '7d')
		.sign(refreshSecret);

	return { accessToken, refreshToken };
}

/**
 * Verify access token
 */
async function verifyAccessToken(token, config) {
	try {
		const secret = new TextEncoder().encode(config.jwtSecret);
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (error) {
		return null;
	}
}

/**
 * Verify refresh token
 */
async function verifyRefreshToken(token, config) {
	try {
		const secret = new TextEncoder().encode(config.jwtRefreshSecret);
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch (error) {
		return null;
	}
}

/**
 * Auth middleware plugin for Hapi
 */
const authPlugin = {
	name: 'auth',
	version: '1.0.0',
	register: async function(server, options) {
		const { config, userModel } = options;

		// Register auth scheme
		server.auth.scheme('jwt', () => ({
			authenticate: async (request, h) => {
				const authorization = request.headers.authorization;

				if (!authorization) {
					return h.unauthenticated(
						new Error('Missing authorization header'),
						{ credentials: null }
					);
				}

				const parts = authorization.split(' ');
				if (parts.length !== 2 || parts[0] !== 'Bearer') {
					return h.unauthenticated(
						new Error('Invalid authorization format'),
						{ credentials: null }
					);
				}

				const token = parts[1];
				const payload = await verifyAccessToken(token, config);

				if (!payload) {
					return h.unauthenticated(
						new Error('Invalid or expired token'),
						{ credentials: null }
					);
				}

				// Get full user from database
				const user = await userModel.findById(payload.sub);
				if (!user) {
					return h.unauthenticated(
						new Error('User not found'),
						{ credentials: null }
					);
				}

				return h.authenticated({
					credentials: {
						user: userModel.prepareForOutput(user),
						userId: user._id.toString()
					}
				});
			}
		}));

		// Register default strategy
		server.auth.strategy('jwt', 'jwt');
	}
};

/**
 * Optional auth - doesn't fail if no token, but adds user if present
 */
async function optionalAuth(request, config, userModel) {
	const authorization = request.headers.authorization;
	if (!authorization) return null;

	const parts = authorization.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

	const payload = await verifyAccessToken(parts[1], config);
	if (!payload) return null;

	const user = await userModel.findById(payload.sub);
	return user ? userModel.prepareForOutput(user) : null;
}

module.exports = {
	createTokens,
	verifyAccessToken,
	verifyRefreshToken,
	authPlugin,
	optionalAuth
};
