'use strict';

const fs = require('fs');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const jsonPath = path.join(__dirname, `${environment}.json`);

let config;

if (fs.existsSync(jsonPath)) {
	const jsonConfig = require(jsonPath);
	config = {
		database: env('DATABASE', jsonConfig.database),
		host: env('HOST', jsonConfig.host),
		port: Number(env('PORT', jsonConfig.port)),
		cron: env('CRON', jsonConfig.cron),
		chromeLaunchConfig: jsonConfig.chromeLaunchConfig || {},
		numWorkers: jsonConfig.numWorkers || 2,
		jwtSecret: env('JWT_SECRET', jsonConfig.jwtSecret || 'change-this-secret-in-production'),
		jwtRefreshSecret: env('JWT_REFRESH_SECRET', jsonConfig.jwtRefreshSecret || 'change-this-refresh-secret'),
		jwtExpiresIn: jsonConfig.jwtExpiresIn || '15m',
		jwtRefreshExpiresIn: jsonConfig.jwtRefreshExpiresIn || '7d',
		stripeSecretKey: env('STRIPE_SECRET_KEY', jsonConfig.stripeSecretKey || ''),
		stripeWebhookSecret: env('STRIPE_WEBHOOK_SECRET', jsonConfig.stripeWebhookSecret || ''),
		resendApiKey: env('RESEND_API_KEY', jsonConfig.resendApiKey || ''),
		frontendUrl: env('FRONTEND_URL', jsonConfig.frontendUrl || 'http://localhost:3001'),
		freeUrlLimit: jsonConfig.freeUrlLimit || 2,
		pagesPerUrl: jsonConfig.pagesPerUrl || 100,
		pricePerUrl: jsonConfig.pricePerUrl || 900 // cents
	};
} else {
	config = {
		database: env('DATABASE', 'mongodb://localhost:27017/wcag-monitor'),
		host: env('HOST', '0.0.0.0'),
		port: Number(env('PORT', '3000')),
		cron: env('CRON', '0 30 0 * * *'),
		chromeLaunchConfig: {
			args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
		},
		numWorkers: Number(env('NUM_WORKERS', '2')),
		jwtSecret: env('JWT_SECRET', 'change-this-secret-in-production'),
		jwtRefreshSecret: env('JWT_REFRESH_SECRET', 'change-this-refresh-secret'),
		jwtExpiresIn: '15m',
		jwtRefreshExpiresIn: '7d',
		stripeSecretKey: env('STRIPE_SECRET_KEY', ''),
		stripeWebhookSecret: env('STRIPE_WEBHOOK_SECRET', ''),
		resendApiKey: env('RESEND_API_KEY', ''),
		frontendUrl: env('FRONTEND_URL', 'http://localhost:3001'),
		freeUrlLimit: 2,
		pagesPerUrl: 100,
		pricePerUrl: 900
	};
}

function env(name, defaultValue) {
	const value = process.env[name];
	return typeof value === 'string' ? value : defaultValue;
}

module.exports = config;
