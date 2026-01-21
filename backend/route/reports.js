'use strict';

const pdfService = require('../services/pdf');

module.exports = function(app) {
	const { server, model } = app;

	// GET /tasks/:taskId/report.pdf - Generate PDF report
	server.route({
		path: '/tasks/{taskId}/report.pdf',
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

			// Get results with full data
			const results = await model.result.getByTaskId(taskId, { 
				full: true, 
				limit: 1 
			});

			try {
				const pdfBuffer = await pdfService.generateReport(task, results);
				
				return h.response(pdfBuffer)
					.type('application/pdf')
					.header(
						'Content-Disposition', 
						`attachment; filename="${task.name.replace(/[^a-z0-9]/gi, '-')}-report.pdf"`
					);
			} catch (error) {
				console.error('PDF generation error:', error);
				return h.response({ 
					error: 'Failed to generate PDF report' 
				}).code(500);
			}
		}
	});
};
