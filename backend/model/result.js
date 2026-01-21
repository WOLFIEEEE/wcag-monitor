'use strict';

const { ObjectId } = require('mongodb');

module.exports = async function({ db }) {
	const collection = db.collection('results');
	
	// Create indexes
	await collection.createIndex({ date: 1 });
	await collection.createIndex({ task: 1 });

	const model = {
		collection,

		/**
		 * Create a new result
		 */
		async create(newResult) {
			if (!newResult.date) {
				newResult.date = Date.now();
			}
			if (newResult.task && !(newResult.task instanceof ObjectId)) {
				newResult.task = new ObjectId(newResult.task);
			}

			// Calculate accessibility score
			newResult.score = model.calculateScore(newResult.count);

			const result = await collection.insertOne(newResult);
			newResult._id = result.insertedId;
			return model.prepareForOutput(newResult);
		},

		/**
		 * Calculate accessibility score (0-100)
		 */
		calculateScore(count) {
			if (!count) return 100;
			
			const { error = 0, warning = 0, notice = 0 } = count;
			// Errors have high weight, warnings medium, notices low
			const penalty = (error * 10) + (warning * 3) + (notice * 0.5);
			const score = Math.max(0, 100 - penalty);
			return Math.round(score);
		},

		/**
		 * Default filter options
		 */
		_defaultFilterOpts(opts) {
			const now = Date.now();
			const thirtyDaysAgo = now - (1000 * 60 * 60 * 24 * 30);
			return {
				from: new Date(opts.from || thirtyDaysAgo).getTime(),
				to: new Date(opts.to || now).getTime(),
				full: Boolean(opts.full),
				task: opts.task,
				limit: opts.limit || 0
			};
		},

		/**
		 * Get filtered results
		 */
		async _getFiltered(opts) {
			opts = model._defaultFilterOpts(opts);
			
			const filter = {
				date: {
					$lt: opts.to,
					$gt: opts.from
				}
			};

			if (opts.task) {
				filter.task = new ObjectId(opts.task);
			}

			const prepare = opts.full 
				? model.prepareForFullOutput 
				: model.prepareForOutput;

			const results = await collection
				.find(filter)
				.sort({ date: -1 })
				.limit(opts.limit)
				.toArray();
			return results.map(prepare);
		},

		/**
		 * Get all results
		 */
		async getAll(opts) {
			delete opts.task;
			return model._getFiltered(opts);
		},

		/**
		 * Get result by ID
		 */
		async getById(id, full) {
			try {
				const objectId = new ObjectId(id);
				const result = await collection.findOne({ _id: objectId });
				
				if (!result) return null;
				
				const prepare = full 
					? model.prepareForFullOutput 
					: model.prepareForOutput;
				return prepare(result);
			} catch (error) {
				console.error(`model:result:getById failed, with id: ${id}`, error.message);
				return null;
			}
		},

		/**
		 * Get results by task ID
		 */
		async getByTaskId(id, opts) {
			opts.task = id;
			return model._getFiltered(opts);
		},

		/**
		 * Delete results by task ID
		 */
		async deleteByTaskId(id) {
			try {
				const objectId = new ObjectId(id);
				await collection.deleteMany({ task: objectId });
				return true;
			} catch (error) {
				console.error(`model:result:deleteByTaskId failed, with id: ${id}`);
				console.error(error.message);
				return false;
			}
		},

		/**
		 * Get result by ID and task ID
		 */
		async getByIdAndTaskId(id, task, opts) {
			const prepare = opts.full 
				? model.prepareForFullOutput 
				: model.prepareForOutput;

			try {
				const result = await collection.findOne({
					_id: new ObjectId(id),
					task: new ObjectId(task)
				});

				return result ? prepare(result) : null;
			} catch (error) {
				console.error(`model:result:getByIdAndTaskId failed, with id: ${id}`);
				console.error(error.message);
				return null;
			}
		},

		/**
		 * Get weekly trend for a task (last 12 weeks)
		 */
		async getWeeklyTrend(taskId) {
			const twelveWeeksAgo = Date.now() - (1000 * 60 * 60 * 24 * 7 * 12);
			
			try {
				const results = await collection
					.find({
						task: new ObjectId(taskId),
						date: { $gt: twelveWeeksAgo }
					})
					.sort({ date: 1 })
					.toArray();

				// Group by week
				const weeklyData = {};
				results.forEach(result => {
					const date = new Date(result.date);
					const weekStart = new Date(date);
					weekStart.setDate(date.getDate() - date.getDay());
					const weekKey = weekStart.toISOString().split('T')[0];

					if (!weeklyData[weekKey]) {
						weeklyData[weekKey] = {
							week: weekKey,
							errors: 0,
							warnings: 0,
							notices: 0,
							score: 0,
							count: 0
						};
					}

					weeklyData[weekKey].errors += result.count?.error || 0;
					weeklyData[weekKey].warnings += result.count?.warning || 0;
					weeklyData[weekKey].notices += result.count?.notice || 0;
					weeklyData[weekKey].score += result.score || 0;
					weeklyData[weekKey].count += 1;
				});

				// Calculate averages
				return Object.values(weeklyData).map(week => ({
					week: week.week,
					errors: Math.round(week.errors / week.count),
					warnings: Math.round(week.warnings / week.count),
					notices: Math.round(week.notices / week.count),
					score: Math.round(week.score / week.count)
				}));
			} catch (error) {
				console.error('model:result:getWeeklyTrend failed');
				console.error(error.message);
				return [];
			}
		},

		/**
		 * Prepare result for output (summary only)
		 */
		prepareForOutput(result) {
			const output = model.prepareForFullOutput(result);
			if (output) {
				delete output.results;
			}
			return output;
		},

		/**
		 * Prepare result for full output
		 */
		prepareForFullOutput(result) {
			if (!result) return null;

			return {
				id: result._id.toString(),
				task: result.task.toString(),
				date: new Date(result.date).toISOString(),
				count: result.count,
				score: result.score || 0,
				ignore: result.ignore || [],
				results: result.results || []
			};
		},

		/**
		 * Convert Pa11y results to our format
		 */
		convertPa11y2Results(results) {
			return {
				count: {
					total: results.issues.length,
					error: results.issues.filter(r => r.type === 'error').length,
					warning: results.issues.filter(r => r.type === 'warning').length,
					notice: results.issues.filter(r => r.type === 'notice').length
				},
				results: results.issues
			};
		}
	};

	return model;
};
