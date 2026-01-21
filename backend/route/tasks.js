'use strict';

const Joi = require('joi');
const groupBy = require('lodash.groupby');
const { isValidAction } = require('pa11y');

module.exports = function(app) {
	const { model, server, config } = app;

	// GET /tasks - Get all tasks for current user
	server.route({
		path: '/tasks',
		method: 'GET',
		options: {
			auth: 'jwt',
			validate: {
				query: Joi.object({
					lastres: Joi.boolean()
				})
			}
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			
			let tasks = await model.task.getAllByUserId(userId);
			if (!tasks) {
				return h.response({ error: 'Failed to fetch tasks' }).code(500);
			}

			if (request.query.lastres) {
				const results = await model.result.getAll({});
				if (results) {
					const resultsByTask = groupBy(results, 'task');
					tasks = tasks.map(task => {
						task.last_result = resultsByTask[task.id]?.length
							? resultsByTask[task.id][0]
							: null;
						return task;
					});
				}
			}

			return h.response(tasks).code(200);
		}
	});

	// POST /tasks - Create new task
	server.route({
		path: '/tasks',
		method: 'POST',
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					url: Joi.string().uri().required(),
					standard: Joi.string().required().valid(
						'Section508',
						'WCAG2A',
						'WCAG2AA',
						'WCAG2AAA'
					),
					timeout: Joi.number().integer(),
					wait: Joi.number().integer(),
					username: Joi.string().allow(''),
					password: Joi.string().allow(''),
					ignore: Joi.array(),
					actions: Joi.array().items(Joi.string()),
					hideElements: Joi.string().allow(''),
					headers: [
						Joi.string().allow(''),
						Joi.object().pattern(/.*/, Joi.string().allow(''))
					]
				})
			}
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const user = request.auth.credentials.user;

			// Check URL limit
			const currentCount = await model.task.countByUserId(userId);
			const urlLimit = model.user.getUrlLimit(user, config.freeUrlLimit);

			if (currentCount >= urlLimit) {
				return h.response({
					error: 'URL limit reached',
					message: `You can monitor up to ${urlLimit} URLs. Upgrade to add more.`,
					currentCount,
					limit: urlLimit
				}).code(403);
			}

			// Validate actions
			const invalidAction = request.payload.actions?.find(
				action => !isValidAction(action)
			);
			if (invalidAction) {
				return h.response({
					error: `Invalid action: "${invalidAction}"`
				}).code(400);
			}

			try {
				const task = await model.task.create(request.payload, userId);
				
				return h.response(task)
					.header('Location', `/tasks/${task.id}`)
					.code(201);
			} catch (error) {
				console.error('Create task error:', error);
				return h.response({ error: 'Failed to create task' }).code(500);
			}
		}
	});

	// GET /tasks/results - Get all results for user's tasks
	server.route({
		path: '/tasks/results',
		method: 'GET',
		options: {
			auth: 'jwt',
			validate: {
				query: Joi.object({
					from: Joi.string().isoDate(),
					to: Joi.string().isoDate(),
					full: Joi.boolean()
				})
			}
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			
			// Get user's tasks first
			const tasks = await model.task.getAllByUserId(userId);
			const taskIds = tasks.map(t => t.id);

			// Get results for those tasks
			const allResults = [];
			for (const taskId of taskIds) {
				const results = await model.result.getByTaskId(taskId, request.query);
				allResults.push(...results);
			}

			// Sort by date descending
			allResults.sort((a, b) => new Date(b.date) - new Date(a.date));

			return h.response(allResults).code(200);
		}
	});

	// GET /tasks/stats - Get statistics for user
	server.route({
		path: '/tasks/stats',
		method: 'GET',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const user = request.auth.credentials.user;

			const tasks = await model.task.getAllByUserId(userId);
			const urlLimit = model.user.getUrlLimit(user, config.freeUrlLimit);

			let totalErrors = 0;
			let totalWarnings = 0;
			let totalNotices = 0;
			let avgScore = 0;
			let tasksWithResults = 0;

			for (const task of tasks) {
				const results = await model.result.getByTaskId(task.id, { limit: 1 });
				if (results.length > 0) {
					const latest = results[0];
					totalErrors += latest.count?.error || 0;
					totalWarnings += latest.count?.warning || 0;
					totalNotices += latest.count?.notice || 0;
					avgScore += latest.score || 0;
					tasksWithResults++;
				}
			}

			if (tasksWithResults > 0) {
				avgScore = Math.round(avgScore / tasksWithResults);
			}

			return h.response({
				urlCount: tasks.length,
				urlLimit,
				urlsRemaining: urlLimit - tasks.length,
				totalErrors,
				totalWarnings,
				totalNotices,
				averageScore: avgScore,
				plan: user.plan,
				paidUrlCount: user.paidUrlCount
			}).code(200);
		}
	});
};
