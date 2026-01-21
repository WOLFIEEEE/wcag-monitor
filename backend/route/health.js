'use strict';

module.exports = function(app) {
	const { server } = app;

	// Health check endpoint
	server.route({
		path: '/health',
		method: 'GET',
		options: {
			auth: false,
			description: 'Health check endpoint for container orchestration',
			tags: ['api', 'health']
		},
		handler: async (request, h) => {
			try {
				// Check database connection
				const db = app.db;
				await db.admin().ping();
				
				return h.response({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					services: {
						database: 'connected',
						api: 'running'
					}
				}).code(200);
			} catch (error) {
				return h.response({
					status: 'unhealthy',
					timestamp: new Date().toISOString(),
					error: error.message
				}).code(503);
			}
		}
	});
};
