'use strict';

const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const SALT_ROUNDS = 12;

module.exports = async function(app) {
	const collection = app.db.collection('users');
	
	// Create indexes
	await collection.createIndex({ email: 1 }, { unique: true });

	const model = {
		collection,

		/**
		 * Create a new user
		 * @param {Object} userData - User data
		 * @returns {Promise<Object>} Created user (without password)
		 */
		async create(userData) {
			const { email, password, name } = userData;

			// Check if user already exists
			const existing = await model.findByEmail(email);
			if (existing) {
				throw new Error('User with this email already exists');
			}

			// Hash password
			const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

			const newUser = {
				email: email.toLowerCase().trim(),
				passwordHash,
				name: name || '',
				plan: 'free',
				paidUrlCount: 0,
				stripeCustomerId: null,
				emailVerified: false,
				verificationToken: null,
				resetToken: null,
				resetTokenExpiry: null,
				notifications: {
					email: true,
					frequency: 'weekly',
					alertOnError: true
				},
				createdAt: new Date(),
				updatedAt: new Date()
			};

			const result = await collection.insertOne(newUser);
			newUser._id = result.insertedId;
			return model.prepareForOutput(newUser);
		},

		/**
		 * Find user by email
		 * @param {string} email
		 * @returns {Promise<Object|null>}
		 */
		async findByEmail(email) {
			return collection.findOne({ 
				email: email.toLowerCase().trim() 
			});
		},

		/**
		 * Find user by ID
		 * @param {string} id
		 * @returns {Promise<Object|null>}
		 */
		async findById(id) {
			try {
				const objectId = new ObjectId(id);
				return collection.findOne({ _id: objectId });
			} catch (error) {
				console.error('Invalid ObjectId:', error.message);
				return null;
			}
		},

		/**
		 * Verify password
		 * @param {string} password - Plain text password
		 * @param {string} hash - Hashed password
		 * @returns {Promise<boolean>}
		 */
		async verifyPassword(password, hash) {
			return bcrypt.compare(password, hash);
		},

		/**
		 * Update user by ID
		 * @param {string} id
		 * @param {Object} updates
		 * @returns {Promise<Object|null>}
		 */
		async updateById(id, updates) {
			try {
				const objectId = new ObjectId(id);
				updates.updatedAt = new Date();
				
				await collection.updateOne(
					{ _id: objectId },
					{ $set: updates }
				);
				
				return model.findById(id);
			} catch (error) {
				console.error('Update user failed:', error.message);
				return null;
			}
		},

		/**
		 * Update password
		 * @param {string} id
		 * @param {string} newPassword
		 * @returns {Promise<boolean>}
		 */
		async updatePassword(id, newPassword) {
			try {
				const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
				const objectId = new ObjectId(id);
				
				await collection.updateOne(
					{ _id: objectId },
					{ 
						$set: { 
							passwordHash,
							resetToken: null,
							resetTokenExpiry: null,
							updatedAt: new Date()
						}
					}
				);
				
				return true;
			} catch (error) {
				console.error('Update password failed:', error.message);
				return false;
			}
		},

		/**
		 * Set verification token
		 * @param {string} id
		 * @param {string} token
		 */
		async setVerificationToken(id, token) {
			return model.updateById(id, { verificationToken: token });
		},

		/**
		 * Verify email with token
		 * @param {string} token
		 * @returns {Promise<Object|null>}
		 */
		async verifyEmail(token) {
			const user = await collection.findOne({ verificationToken: token });
			if (!user) return null;

			await collection.updateOne(
				{ _id: user._id },
				{ 
					$set: { 
						emailVerified: true, 
						verificationToken: null,
						updatedAt: new Date()
					}
				}
			);

			return model.findById(user._id.toString());
		},

		/**
		 * Set password reset token
		 * @param {string} email
		 * @param {string} token
		 * @returns {Promise<Object|null>}
		 */
		async setResetToken(email, token) {
			const user = await model.findByEmail(email);
			if (!user) return null;

			const expiry = new Date();
			expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

			await collection.updateOne(
				{ _id: user._id },
				{ 
					$set: { 
						resetToken: token,
						resetTokenExpiry: expiry,
						updatedAt: new Date()
					}
				}
			);

			return model.findById(user._id.toString());
		},

		/**
		 * Find user by reset token
		 * @param {string} token
		 * @returns {Promise<Object|null>}
		 */
		async findByResetToken(token) {
			return collection.findOne({
				resetToken: token,
				resetTokenExpiry: { $gt: new Date() }
			});
		},

		/**
		 * Update Stripe customer ID
		 * @param {string} id
		 * @param {string} stripeCustomerId
		 */
		async setStripeCustomerId(id, stripeCustomerId) {
			return model.updateById(id, { stripeCustomerId });
		},

		/**
		 * Update user plan
		 * @param {string} id
		 * @param {string} plan - 'free' or 'pro'
		 * @param {number} paidUrlCount
		 */
		async updatePlan(id, plan, paidUrlCount = 0) {
			return model.updateById(id, { plan, paidUrlCount });
		},

		/**
		 * Get URL limit for user
		 * @param {Object} user
		 * @param {number} freeLimit
		 * @returns {number}
		 */
		getUrlLimit(user, freeLimit = 2) {
			return freeLimit + (user.paidUrlCount || 0);
		},

		/**
		 * Prepare user for output (remove sensitive fields)
		 * @param {Object} user
		 * @returns {Object}
		 */
		prepareForOutput(user) {
			if (!user) return null;
			
			return {
				id: user._id.toString(),
				email: user.email,
				name: user.name,
				plan: user.plan,
				paidUrlCount: user.paidUrlCount || 0,
				emailVerified: user.emailVerified,
				notifications: user.notifications,
				createdAt: user.createdAt
			};
		}
	};

	return model;
};
