'use strict';

const Joi = require('joi');

module.exports = function(app) {
	const { server, model, config } = app;

	// Skip if Stripe not configured
	if (!config.stripeSecretKey) {
		console.log('Stripe not configured, billing routes disabled');
		return;
	}

	const stripe = require('stripe')(config.stripeSecretKey);

	// POST /billing/checkout - Create checkout session for adding URLs
	server.route({
		path: '/billing/checkout',
		method: 'POST',
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					quantity: Joi.number().integer().min(1).max(100).required()
				})
			}
		},
		handler: async (request, h) => {
			try {
				const userId = request.auth.credentials.userId;
				const user = await model.user.findById(userId);
				const { quantity } = request.payload;

				// Create or get Stripe customer
				let customerId = user.stripeCustomerId;
				if (!customerId) {
					const customer = await stripe.customers.create({
						email: user.email,
						metadata: { userId }
					});
					customerId = customer.id;
					await model.user.setStripeCustomerId(userId, customerId);
				}

				// Create checkout session
				const session = await stripe.checkout.sessions.create({
					customer: customerId,
					payment_method_types: ['card'],
					line_items: [{
						price_data: {
							currency: 'usd',
							product_data: {
								name: 'Additional URL Monitoring',
								description: `Monitor ${quantity} additional URL(s) - 100 pages each, daily scans`
							},
							unit_amount: config.pricePerUrl, // $9.00 in cents
							recurring: {
								interval: 'month'
							}
						},
						quantity
					}],
					mode: 'subscription',
					success_url: `${config.frontendUrl}/dashboard/billing?success=true`,
					cancel_url: `${config.frontendUrl}/dashboard/billing?canceled=true`,
					metadata: {
						userId,
						urlQuantity: quantity.toString()
					}
				});

				return h.response({
					sessionId: session.id,
					url: session.url
				}).code(200);

			} catch (error) {
				console.error('Checkout error:', error);
				return h.response({ 
					error: 'Failed to create checkout session' 
				}).code(500);
			}
		}
	});

	// POST /billing/portal - Create customer portal session
	server.route({
		path: '/billing/portal',
		method: 'POST',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			try {
				const userId = request.auth.credentials.userId;
				const user = await model.user.findById(userId);

				if (!user.stripeCustomerId) {
					return h.response({ 
						error: 'No billing account found' 
					}).code(400);
				}

				const session = await stripe.billingPortal.sessions.create({
					customer: user.stripeCustomerId,
					return_url: `${config.frontendUrl}/dashboard/billing`
				});

				return h.response({
					url: session.url
				}).code(200);

			} catch (error) {
				console.error('Portal error:', error);
				return h.response({ 
					error: 'Failed to create portal session' 
				}).code(500);
			}
		}
	});

	// POST /billing/webhook - Handle Stripe webhooks
	server.route({
		path: '/billing/webhook',
		method: 'POST',
		options: {
			auth: false,
			payload: {
				output: 'data',
				parse: false
			}
		},
		handler: async (request, h) => {
			const sig = request.headers['stripe-signature'];
			let event;

			try {
				event = stripe.webhooks.constructEvent(
					request.payload,
					sig,
					config.stripeWebhookSecret
				);
			} catch (error) {
				console.error('Webhook signature verification failed:', error.message);
				return h.response({ error: 'Invalid signature' }).code(400);
			}

			// Handle the event
			switch (event.type) {
				case 'checkout.session.completed': {
					const session = event.data.object;
					const userId = session.metadata.userId;
					const urlQuantity = parseInt(session.metadata.urlQuantity, 10);

					if (userId && urlQuantity) {
						const user = await model.user.findById(userId);
						const newPaidCount = (user.paidUrlCount || 0) + urlQuantity;
						await model.user.updatePlan(userId, 'pro', newPaidCount);
						console.log(`User ${userId} added ${urlQuantity} URLs, total: ${newPaidCount}`);
					}
					break;
				}

				case 'customer.subscription.updated': {
					const subscription = event.data.object;
					// Handle subscription updates (e.g., quantity changes)
					console.log('Subscription updated:', subscription.id);
					break;
				}

				case 'customer.subscription.deleted': {
					const subscription = event.data.object;
					const customerId = subscription.customer;
					
					// Find user by Stripe customer ID and reset to free
					const users = await model.user.collection.find({ 
						stripeCustomerId: customerId 
					}).toArray();
					
					if (users.length > 0) {
						const user = users[0];
						await model.user.updatePlan(user._id.toString(), 'free', 0);
						console.log(`User ${user._id} subscription canceled, reset to free`);
					}
					break;
				}

				case 'invoice.payment_failed': {
					const invoice = event.data.object;
					console.log('Payment failed for invoice:', invoice.id);
					// TODO: Send email notification
					break;
				}

				default:
					console.log(`Unhandled event type: ${event.type}`);
			}

			return h.response({ received: true }).code(200);
		}
	});

	// GET /billing/usage - Get current usage and billing info
	server.route({
		path: '/billing/usage',
		method: 'GET',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			try {
				const userId = request.auth.credentials.userId;
				const user = await model.user.findById(userId);
				
				const taskCount = await model.task.countByUserId(userId);
				const urlLimit = model.user.getUrlLimit(user, config.freeUrlLimit);

				const response = {
					plan: user.plan,
					freeUrls: config.freeUrlLimit,
					paidUrls: user.paidUrlCount || 0,
					totalLimit: urlLimit,
					currentUsage: taskCount,
					remaining: urlLimit - taskCount,
					pricePerUrl: config.pricePerUrl / 100, // Convert cents to dollars
					pagesPerUrl: config.pagesPerUrl
				};

				// If user has Stripe customer, get subscription details
				if (user.stripeCustomerId && config.stripeSecretKey) {
					try {
						const subscriptions = await stripe.subscriptions.list({
							customer: user.stripeCustomerId,
							status: 'active',
							limit: 1
						});

						if (subscriptions.data.length > 0) {
							const sub = subscriptions.data[0];
							response.subscription = {
								id: sub.id,
								status: sub.status,
								currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
								cancelAtPeriodEnd: sub.cancel_at_period_end
							};
						}
					} catch (e) {
						// Stripe error, continue without subscription info
					}
				}

				return h.response(response).code(200);

			} catch (error) {
				console.error('Usage error:', error);
				return h.response({ 
					error: 'Failed to get usage info' 
				}).code(500);
			}
		}
	});
};
