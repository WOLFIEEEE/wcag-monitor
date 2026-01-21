'use strict';

const Hapi = require('@hapi/hapi');
const { MongoClient } = require('mongodb');
const { dim } = require('kleur');
const { authPlugin } = require('./middleware/auth');

async function initApp(config) {
	const app = {
		server: new Hapi.Server({
			host: config.host,
			port: config.port,
			routes: {
				cors: {
					origin: ['*'],
					headers: ['Accept', 'Authorization', 'Content-Type'],
					credentials: true
				}
			}
		}),
		db: null,
		client: null,
		model: {},
		config
	};

	// Connect to database
	const client = new MongoClient(config.database);
	await client.connect();
	console.log(dim('mongodb: connected'));
	app.client = client;
	app.db = client.db();

	// Initialize models (all now return promises directly)
	app.model.user = await require('./model/user')(app);
	app.model.result = await require('./model/result')(app);
	app.model.task = await require('./model/task')(app);

	// Register auth plugin
	await app.server.register({
		plugin: authPlugin,
		options: {
			config: config,
			userModel: app.model.user
		}
	});

	// Initialize cron jobs (if not in test mode)
	if (!config.dbOnly && process.env.NODE_ENV !== 'test') {
		require('./task/cron')(config, app);
	}

	// Register routes and start server
	if (!config.dbOnly) {
		require('./route/index')(app);
		require('./route/health')(app);
		require('./route/auth')(app);
		require('./route/tasks')(app);
		require('./route/task')(app);
		require('./route/reports')(app);
		
		// Try to register billing routes if Stripe is configured
		if (config.stripeSecretKey) {
			try {
				require('./route/billing')(app);
			} catch (e) {
				console.log(dim('Billing routes not loaded (Stripe not configured)'));
			}
		}

		await app.server.start();
		console.log(`Server running at: ${app.server.info.uri}`);
	}

	return app;
}

// Wrapper for backward compatibility with callback-style
function initAppCallback(config, callback) {
	initApp(config)
		.then(app => callback(null, app))
		.catch(error => callback(error, null));
}

module.exports = initAppCallback;
module.exports.async = initApp;
