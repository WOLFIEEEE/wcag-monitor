'use strict';

const { grey } = require('kleur');
const { ObjectId } = require('mongodb');
const pa11y = require('pa11y');

module.exports = async function(app) {
	const collection = app.db.collection('tasks');
	
	// Create indexes
	await collection.createIndex({
		name: 1,
		url: 1,
		standard: 1
	});
	await collection.createIndex({ userId: 1 });

	const model = {
		collection,

		/**
		 * Create a new task
		 */
		async create(newTask, userId) {
			newTask.headers = model.sanitizeHeaderInput(newTask.headers);
			newTask.userId = new ObjectId(userId);
			newTask.pageLimit = newTask.pageLimit || app.config.pagesPerUrl || 100;
			newTask.createdAt = new Date();
			newTask.updatedAt = new Date();
			newTask.lastRun = null;

			const result = await collection.insertOne(newTask);
			newTask._id = result.insertedId;
			return model.prepareForOutput(newTask);
		},

		/**
		 * Get all tasks (for admin/cron)
		 */
		async getAll() {
			const tasks = await collection
				.find()
				.sort({ name: 1, standard: 1, url: 1 })
				.toArray();
			return tasks.map(model.prepareForOutput);
		},

		/**
		 * Get all tasks for a specific user
		 */
		async getAllByUserId(userId) {
			const tasks = await collection
				.find({ userId: new ObjectId(userId) })
				.sort({ name: 1, standard: 1, url: 1 })
				.toArray();
			return tasks.map(model.prepareForOutput);
		},

		/**
		 * Count tasks for a user
		 */
		async countByUserId(userId) {
			return collection.countDocuments({ 
				userId: new ObjectId(userId) 
			});
		},

		/**
		 * Get task by ID
		 */
		async getById(id) {
			try {
				const objectId = new ObjectId(id);
				const task = await collection.findOne({ _id: objectId });
				return model.prepareForOutput(task);
			} catch (error) {
				console.error('ObjectId generation failed.', error.message);
				return null;
			}
		},

		/**
		 * Get task by ID and verify ownership
		 */
		async getByIdAndUserId(id, userId) {
			try {
				const task = await collection.findOne({
					_id: new ObjectId(id),
					userId: new ObjectId(userId)
				});
				return model.prepareForOutput(task);
			} catch (error) {
				console.error('model:task:getByIdAndUserId failed');
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Edit task by ID
		 */
		async editById(id, edits, userId = null) {
			const idString = id;
			try {
				const objectId = new ObjectId(id);
				const now = Date.now();
				
				const query = { _id: objectId };
				if (userId) {
					query.userId = new ObjectId(userId);
				}

				const taskEdits = {
					updatedAt: new Date()
				};

				if (edits.name !== undefined) taskEdits.name = edits.name;
				if (edits.timeout !== undefined) taskEdits.timeout = parseInt(edits.timeout, 10);
				if (edits.wait !== undefined) taskEdits.wait = parseInt(edits.wait, 10);
				if (edits.actions !== undefined) taskEdits.actions = edits.actions;
				if (edits.username !== undefined) taskEdits.username = edits.username;
				if (edits.password !== undefined) taskEdits.password = edits.password;
				if (edits.ignore !== undefined) taskEdits.ignore = edits.ignore;
				if (edits.hideElements !== undefined) taskEdits.hideElements = edits.hideElements;
				if (edits.headers !== undefined) {
					taskEdits.headers = model.sanitizeHeaderInput(edits.headers);
				}

				const result = await collection.updateOne(query, { $set: taskEdits });
				
				if (result.matchedCount < 1) {
					return 0;
				}

				const annotation = {
					type: 'edit',
					date: now,
					comment: edits.comment || 'Edited task'
				};
				await model.addAnnotationById(idString, annotation);
				
				return result.modifiedCount;
			} catch (error) {
				console.error(`model:task:editById failed, with id: ${id}`);
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Add annotation to task
		 */
		async addAnnotationById(id, annotation) {
			try {
				const task = await model.getById(id);
				if (!task) return 0;

				const objectId = new ObjectId(id);
				
				if (Array.isArray(task.annotations)) {
					await collection.updateOne(
						{ _id: objectId },
						{ $push: { annotations: annotation } }
					);
				} else {
					await collection.updateOne(
						{ _id: objectId },
						{ $set: { annotations: [annotation] } }
					);
				}
				return 1;
			} catch (error) {
				console.error(`model:task:addAnnotationById failed, with id: ${id}`);
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Delete task by ID
		 */
		async deleteById(id, userId = null) {
			try {
				const query = { _id: new ObjectId(id) };
				if (userId) {
					query.userId = new ObjectId(userId);
				}

				const result = await collection.deleteOne(query);
				return result ? result.deletedCount : null;
			} catch (error) {
				console.error(`model:task:deleteById failed, with id: ${id}`);
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Run task by ID
		 */
		async runById(id) {
			try {
				const task = await model.getById(id);
				if (!task) {
					throw new Error('Task not found');
				}

				const pa11yOptions = {
					standard: task.standard,
					includeWarnings: true,
					includeNotices: true,
					timeout: task.timeout || 30000,
					wait: task.wait || 0,
					ignore: task.ignore,
					actions: task.actions || [],
					chromeLaunchConfig: app.config.chromeLaunchConfig || {},
					headers: task.headers || {},
					log: {
						debug: model.pa11yLog(task.id),
						error: model.pa11yLog(task.id),
						info: model.pa11yLog(task.id),
						log: model.pa11yLog(task.id)
					}
				};

				if (task.username && task.password && !pa11yOptions.headers['Authorization']) {
					const encodedCredentials = Buffer.from(`${task.username}:${task.password}`)
						.toString('base64');
					pa11yOptions.headers['Authorization'] = `Basic ${encodedCredentials}`;
				}

				if (task.hideElements) {
					pa11yOptions.hideElements = task.hideElements;
				}

				const pa11yResults = await pa11y(task.url, pa11yOptions);

				// Update last run time
				await collection.updateOne(
					{ _id: new ObjectId(id) },
					{ $set: { lastRun: new Date() } }
				);

				const results = app.model.result.convertPa11y2Results(pa11yResults);
				results.task = task.id;
				results.ignore = task.ignore;
				
				const response = await app.model.result.create(results);
				return response;
			} catch (error) {
				console.error(`model:task:runById failed, with id: ${id}`);
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Prepare task for output
		 */
		prepareForOutput(task) {
			if (!task) return null;

			const output = {
				id: task._id.toString(),
				userId: task.userId ? task.userId.toString() : null,
				name: task.name,
				url: task.url,
				timeout: task.timeout ? parseInt(task.timeout, 10) : 30000,
				wait: task.wait ? parseInt(task.wait, 10) : 0,
				standard: task.standard,
				ignore: task.ignore || [],
				actions: task.actions || [],
				pageLimit: task.pageLimit || 100,
				lastRun: task.lastRun,
				createdAt: task.createdAt,
				updatedAt: task.updatedAt
			};

			if (task.annotations) output.annotations = task.annotations;
			if (task.username) output.username = task.username;
			if (task.password) output.password = task.password;
			if (task.hideElements) output.hideElements = task.hideElements;
			
			if (task.headers) {
				if (typeof task.headers === 'string') {
					try {
						output.headers = JSON.parse(task.headers);
					} catch (error) {
						console.error('Header input contains invalid JSON:', task.headers);
					}
				} else {
					output.headers = task.headers;
				}
			}

			return output;
		},

		/**
		 * Sanitize header input
		 */
		sanitizeHeaderInput(headers) {
			if (typeof headers === 'string') {
				try {
					return JSON.parse(headers);
				} catch (error) {
					console.error('Header input contains invalid JSON:', headers);
					return null;
				}
			}
			return headers;
		},

		/**
		 * Pa11y logging helper
		 */
		pa11yLog(taskId) {
			return message => {
				const messageString = taskId
					? `[${taskId}]  > ${message}`
					: `  > ${message}`;
				console.log(grey(messageString));
			};
		}
	};

	return model;
};
