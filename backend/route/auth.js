'use strict';

const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const { createTokens, verifyRefreshToken } = require('../middleware/auth');

module.exports = function(app) {
	const { server, model, config } = app;

	// POST /auth/signup - Register new user
	server.route({
		path: '/auth/signup',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().min(8).required(),
					name: Joi.string().max(100).allow('')
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { email, password, name } = request.payload;

				// Create user
				const user = await model.user.create({ email, password, name });

				// Generate verification token
				const verificationToken = uuidv4();
				await model.user.setVerificationToken(user.id, verificationToken);

				// TODO: Send verification email via Resend
				// For now, just log it
				console.log(`Verification token for ${email}: ${verificationToken}`);

				// Create tokens
				const fullUser = await model.user.findById(user.id);
				const tokens = await createTokens(fullUser, config);

				return h.response({
					message: 'User created successfully',
					user,
					...tokens
				}).code(201);

			} catch (error) {
				if (error.message.includes('already exists')) {
					return h.response({ 
						error: 'User with this email already exists' 
					}).code(409);
				}
				console.error('Signup error:', error);
				return h.response({ 
					error: 'Failed to create user' 
				}).code(500);
			}
		}
	});

	// POST /auth/login - Login user
	server.route({
		path: '/auth/login',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { email, password } = request.payload;

				// Find user
				const user = await model.user.findByEmail(email);
				if (!user) {
					return h.response({ 
						error: 'Invalid email or password' 
					}).code(401);
				}

				// Verify password
				const valid = await model.user.verifyPassword(password, user.passwordHash);
				if (!valid) {
					return h.response({ 
						error: 'Invalid email or password' 
					}).code(401);
				}

				// Create tokens
				const tokens = await createTokens(user, config);

				return h.response({
					message: 'Login successful',
					user: model.user.prepareForOutput(user),
					...tokens
				}).code(200);

			} catch (error) {
				console.error('Login error:', error);
				return h.response({ 
					error: 'Login failed' 
				}).code(500);
			}
		}
	});

	// POST /auth/refresh - Refresh access token
	server.route({
		path: '/auth/refresh',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					refreshToken: Joi.string().required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { refreshToken } = request.payload;

				// Verify refresh token
				const payload = await verifyRefreshToken(refreshToken, config);
				if (!payload) {
					return h.response({ 
						error: 'Invalid or expired refresh token' 
					}).code(401);
				}

				// Get user
				const user = await model.user.findById(payload.sub);
				if (!user) {
					return h.response({ 
						error: 'User not found' 
					}).code(401);
				}

				// Create new tokens
				const tokens = await createTokens(user, config);

				return h.response({
					message: 'Token refreshed',
					...tokens
				}).code(200);

			} catch (error) {
				console.error('Refresh error:', error);
				return h.response({ 
					error: 'Token refresh failed' 
				}).code(500);
			}
		}
	});

	// POST /auth/forgot - Request password reset
	server.route({
		path: '/auth/forgot',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					email: Joi.string().email().required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { email } = request.payload;

				// Generate reset token
				const resetToken = uuidv4();
				const user = await model.user.setResetToken(email, resetToken);

				if (user) {
					// TODO: Send reset email via Resend
					console.log(`Reset token for ${email}: ${resetToken}`);
				}

				// Always return success to prevent email enumeration
				return h.response({
					message: 'If an account exists with this email, a reset link has been sent'
				}).code(200);

			} catch (error) {
				console.error('Forgot password error:', error);
				return h.response({ 
					error: 'Failed to process request' 
				}).code(500);
			}
		}
	});

	// POST /auth/reset - Reset password with token
	server.route({
		path: '/auth/reset',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					token: Joi.string().required(),
					password: Joi.string().min(8).required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { token, password } = request.payload;

				// Find user by reset token
				const user = await model.user.findByResetToken(token);
				if (!user) {
					return h.response({ 
						error: 'Invalid or expired reset token' 
					}).code(400);
				}

				// Update password
				const success = await model.user.updatePassword(
					user._id.toString(), 
					password
				);

				if (!success) {
					return h.response({ 
						error: 'Failed to update password' 
					}).code(500);
				}

				return h.response({
					message: 'Password updated successfully'
				}).code(200);

			} catch (error) {
				console.error('Reset password error:', error);
				return h.response({ 
					error: 'Failed to reset password' 
				}).code(500);
			}
		}
	});

	// GET /auth/me - Get current user
	server.route({
		path: '/auth/me',
		method: 'GET',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			return h.response({
				user: request.auth.credentials.user
			}).code(200);
		}
	});

	// POST /auth/verify-email - Verify email with token
	server.route({
		path: '/auth/verify-email',
		method: 'POST',
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					token: Joi.string().required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const { token } = request.payload;

				const user = await model.user.verifyEmail(token);
				if (!user) {
					return h.response({ 
						error: 'Invalid verification token' 
					}).code(400);
				}

				return h.response({
					message: 'Email verified successfully',
					user: model.user.prepareForOutput(user)
				}).code(200);

			} catch (error) {
				console.error('Verify email error:', error);
				return h.response({ 
					error: 'Failed to verify email' 
				}).code(500);
			}
		}
	});

	// PATCH /auth/profile - Update user profile
	server.route({
		path: '/auth/profile',
		method: 'PATCH',
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					name: Joi.string().max(100),
					notifications: Joi.object({
						email: Joi.boolean(),
						frequency: Joi.string().valid('daily', 'weekly'),
						alertOnError: Joi.boolean()
					})
				})
			}
		},
		handler: async (request, h) => {
			try {
				const userId = request.auth.credentials.userId;
				const updates = request.payload;

				const user = await model.user.updateById(userId, updates);
				if (!user) {
					return h.response({ 
						error: 'Failed to update profile' 
					}).code(500);
				}

				return h.response({
					message: 'Profile updated',
					user: model.user.prepareForOutput(user)
				}).code(200);

			} catch (error) {
				console.error('Update profile error:', error);
				return h.response({ 
					error: 'Failed to update profile' 
				}).code(500);
			}
		}
	});

	// PATCH /auth/password - Change password
	server.route({
		path: '/auth/password',
		method: 'PATCH',
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					currentPassword: Joi.string().required(),
					newPassword: Joi.string().min(8).required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const userId = request.auth.credentials.userId;
				const { currentPassword, newPassword } = request.payload;

				// Get full user with password hash
				const user = await model.user.findById(userId);
				if (!user) {
					return h.response({ 
						error: 'User not found' 
					}).code(404);
				}

				// Verify current password
				const valid = await model.user.verifyPassword(
					currentPassword, 
					user.passwordHash
				);
				if (!valid) {
					return h.response({ 
						error: 'Current password is incorrect' 
					}).code(400);
				}

				// Update password
				const success = await model.user.updatePassword(userId, newPassword);
				if (!success) {
					return h.response({ 
						error: 'Failed to update password' 
					}).code(500);
				}

				return h.response({
					message: 'Password updated successfully'
				}).code(200);

			} catch (error) {
				console.error('Change password error:', error);
				return h.response({ 
					error: 'Failed to change password' 
				}).code(500);
			}
		}
	});
};
