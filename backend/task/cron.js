'use strict';

const { CronJob } = require('cron');
const { green, grey, red, yellow } = require('kleur');
const async = require('async');

module.exports = function(config, app) {
	if (!config.cron) {
		console.log(grey('Cron jobs: disabled'));
		return;
	}

	console.log(grey('Cron jobs: enabled (%s)'), config.cron);

	const job = new CronJob(
		config.cron,
		async function() {
			console.log(yellow('Starting scheduled tasks @ %s'), new Date());

			try {
				const tasks = await app.model.task.getAll();
				
				if (tasks.length === 0) {
					console.log(grey('No tasks to run'));
					return;
				}

				console.log(grey('Running %d tasks with %d workers'), 
					tasks.length, 
					config.numWorkers
				);

				// Run tasks with limited concurrency
				await async.eachLimit(
					tasks,
					config.numWorkers,
					async (task) => {
						try {
							console.log(grey('Running task: %s (%s)'), task.name, task.url);
							await app.model.task.runById(task.id);
							console.log(green('Completed task: %s'), task.name);
						} catch (error) {
							console.log(red('Failed task: %s - %s'), task.name, error.message);
						}
					}
				);

				console.log(yellow('Finished scheduled tasks @ %s'), new Date());
			} catch (error) {
				console.error(red('Cron job error:'), error.message);
			}
		},
		null,
		true,
		'UTC'
	);

	job.start();
};
