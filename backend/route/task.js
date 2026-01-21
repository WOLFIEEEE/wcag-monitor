'use strict';

const { green, grey, red } = require('kleur');
const Joi = require('joi');
const { isValidAction } = require('pa11y');

module.exports = function(app) {
	const { model, server } = app;

	// GET /tasks/:taskId - Get single task
	server.route({
		path: '/tasks/{taskId}',
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
			const { taskId } = request.params;

			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			if (request.query.lastres) {
				const results = await model.result.getByTaskId(task.id, {
					limit: 1,
					full: true
				});
				task.last_result = results.length ? results[0] : null;
			}

			return h.response(task).code(200);
		}
	});

	// PATCH /tasks/:taskId - Update task
	server.route({
		path: '/tasks/{taskId}',
		method: 'PATCH',
		options: {
			auth: 'jwt',
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					timeout: Joi.number().integer(),
					wait: Joi.number().integer(),
					ignore: Joi.array(),
					actions: Joi.array().items(Joi.string()),
					comment: Joi.string(),
					username: Joi.string().allow(''),
					password: Joi.string().allow(''),
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
			const { taskId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
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

			const updateCount = await model.task.editById(taskId, request.payload, userId);
			if (updateCount < 1) {
				return h.response({ error: 'Failed to update task' }).code(500);
			}

			const updatedTask = await model.task.getById(taskId);
			return h.response(updatedTask).code(200);
		}
	});

	// DELETE /tasks/:taskId - Delete task
	server.route({
		path: '/tasks/{taskId}',
		method: 'DELETE',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const { taskId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			const deleted = await model.task.deleteById(taskId, userId);
			if (!deleted) {
				return h.response({ error: 'Failed to delete task' }).code(500);
			}

			// Delete associated results
			await model.result.deleteByTaskId(taskId);

			return h.response().code(204);
		}
	});

	// POST /tasks/:taskId/run - Run task manually
	server.route({
		path: '/tasks/{taskId}/run',
		method: 'POST',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const { taskId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			console.log(grey('Starting task run @ %s'), new Date());
			
			try {
				const result = await model.task.runById(taskId);

				if (result) {
					console.log(green('Finished task %s'), task.id);
					console.log(grey('Finished task run @ %s'), new Date());
					
					return h.response(result).code(200);
				} else {
					console.log(red('Failed to finish task %s'), task.id);
					return h.response({ 
						error: `Failed to run task ${task.id}` 
					}).code(500);
				}
			} catch (error) {
				console.error('Task run error:', error);
				return h.response({ 
					error: 'Task execution failed',
					message: error.message
				}).code(500);
			}
		}
	});

	// GET /tasks/:taskId/results - Get results for task
	server.route({
		path: '/tasks/{taskId}/results',
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
			const { taskId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			const results = await model.result.getByTaskId(taskId, request.query);
			return h.response(results).code(200);
		}
	});

	// GET /tasks/:taskId/results/:resultId - Get single result
	server.route({
		path: '/tasks/{taskId}/results/{resultId}',
		method: 'GET',
		options: {
			auth: 'jwt',
			validate: {
				query: Joi.object({
					full: Joi.boolean()
				})
			}
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const { taskId, resultId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			const result = await model.result.getByIdAndTaskId(
				resultId, 
				taskId, 
				request.query
			);

			if (!result) {
				return h.response({ error: 'Result not found' }).code(404);
			}

			return h.response(result).code(200);
		}
	});

	// GET /tasks/:taskId/trend - Get trend data for task
	server.route({
		path: '/tasks/{taskId}/trend',
		method: 'GET',
		options: {
			auth: 'jwt'
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.userId;
			const { taskId } = request.params;

			// Verify ownership
			const task = await model.task.getByIdAndUserId(taskId, userId);
			if (!task) {
				return h.response({ error: 'Task not found' }).code(404);
			}

			const trend = await model.result.getWeeklyTrend(taskId);
			return h.response(trend).code(200);
		}
	});
};
