'use strict';

const { cyan, grey, red, underline } = require('kleur');
const { URL } = require('url');
const config = require('./config');

process.on('SIGINT', () => {
	console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
	process.exit();
});

console.log(underline(cyan('\nWCAG Monitor API starting')));
console.log(grey('mode:        %s'), process.env.NODE_ENV || 'development');
console.log(grey('database:    %s'), hideCredentialsInConnectionString(config.database));
console.log(grey('cron:        %s'), config.cron || 'disabled');
console.log(grey('workers:     %s'), config.numWorkers);
console.log(grey('free URLs:   %s'), config.freeUrlLimit);
console.log(grey('pages/URL:   %s'), config.pagesPerUrl);

const app = require('./app');

function hideCredentialsInConnectionString(connectionString) {
	try {
		const url = new URL(connectionString);
		if (url.username) url.username = '****';
		if (url.password) url.password = '****';
		return url.toString();
	} catch {
		return connectionString;
	}
}

app(config, (error, result) => {
	if (error) {
		console.error(red('\nError starting WCAG Monitor API:'));
		console.error(error.message);
		process.exit(1);
	}
	
	const { server } = result;
	console.log(underline(cyan('\nWCAG Monitor API started')));
	console.log(grey('service uri: %s'), server.info.uri);
	console.log('');
});
