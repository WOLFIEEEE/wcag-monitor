'use strict';

module.exports = function(app) {
	const { server } = app;

	// Health check
	server.route({
		path: '/',
		method: 'GET',
		options: {
			auth: false
		},
		handler: (request, h) => {
			return h.response({
				name: 'WCAG Monitor API',
				version: '1.0.0',
				status: 'healthy',
				timestamp: new Date().toISOString()
			}).code(200);
		}
	});

	// API info
	server.route({
		path: '/api',
		method: 'GET',
		options: {
			auth: false
		},
		handler: (request, h) => {
			return h.response({
				name: 'WCAG Monitor API',
				version: '1.0.0',
				endpoints: {
					auth: {
						'POST /auth/signup': 'Register new user',
						'POST /auth/login': 'Login user',
						'POST /auth/refresh': 'Refresh access token',
						'POST /auth/forgot': 'Request password reset',
						'POST /auth/reset': 'Reset password',
						'GET /auth/me': 'Get current user',
						'PATCH /auth/profile': 'Update profile',
						'PATCH /auth/password': 'Change password'
					},
					tasks: {
						'GET /tasks': 'Get all tasks',
						'POST /tasks': 'Create task',
						'GET /tasks/stats': 'Get statistics',
						'GET /tasks/results': 'Get all results',
						'GET /tasks/:id': 'Get single task',
						'PATCH /tasks/:id': 'Update task',
						'DELETE /tasks/:id': 'Delete task',
						'POST /tasks/:id/run': 'Run task',
						'GET /tasks/:id/results': 'Get task results',
						'GET /tasks/:id/trend': 'Get task trend'
					},
					billing: {
						'POST /billing/checkout': 'Create checkout session',
						'POST /billing/portal': 'Create portal session',
						'POST /billing/webhook': 'Stripe webhook',
						'GET /billing/usage': 'Get usage info'
					}
				}
			}).code(200);
		}
	});
};
