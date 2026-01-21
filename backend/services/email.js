'use strict';

// Email service using Resend
const config = require('../config');

let resend = null;
if (config.resendApiKey) {
	const { Resend } = require('resend');
	resend = new Resend(config.resendApiKey);
}

const FROM_EMAIL = 'WCAG Monitor <noreply@thewcag.com>';

/**
 * Send welcome email to new user
 */
async function sendWelcome(user) {
	if (!resend) {
		console.log('[Email] Would send welcome email to:', user.email);
		return;
	}

	try {
		await resend.emails.send({
			from: FROM_EMAIL,
			to: user.email,
			subject: 'Welcome to WCAG Monitor!',
			html: `
				<h1>Welcome to WCAG Monitor, ${user.name || 'there'}! 👋</h1>
				<p>Thanks for signing up. You're now ready to start monitoring your websites for accessibility issues.</p>
				<h2>Getting Started</h2>
				<ol>
					<li>Add your first website URL from the dashboard</li>
					<li>We'll automatically scan it for WCAG compliance</li>
					<li>Review the results and fix any issues found</li>
				</ol>
				<p>Your free plan includes:</p>
				<ul>
					<li>✅ 2 URLs</li>
					<li>✅ 100 pages per URL</li>
					<li>✅ Weekly automated scans</li>
				</ul>
				<p>
					<a href="${config.frontendUrl}/dashboard" style="background-color: #228be6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						Go to Dashboard
					</a>
				</p>
				<p>Happy testing!</p>
				<p>— The WCAG Monitor Team</p>
			`
		});
		console.log('[Email] Welcome email sent to:', user.email);
	} catch (error) {
		console.error('[Email] Failed to send welcome email:', error.message);
	}
}

/**
 * Send email verification link
 */
async function sendVerification(user, token) {
	if (!resend) {
		console.log('[Email] Would send verification email to:', user.email);
		console.log('[Email] Verification token:', token);
		return;
	}

	const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;

	try {
		await resend.emails.send({
			from: FROM_EMAIL,
			to: user.email,
			subject: 'Verify your email - WCAG Monitor',
			html: `
				<h1>Verify Your Email</h1>
				<p>Hi ${user.name || 'there'},</p>
				<p>Please click the button below to verify your email address:</p>
				<p>
					<a href="${verifyUrl}" style="background-color: #228be6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						Verify Email
					</a>
				</p>
				<p>Or copy this link: ${verifyUrl}</p>
				<p>This link expires in 24 hours.</p>
				<p>— The WCAG Monitor Team</p>
			`
		});
		console.log('[Email] Verification email sent to:', user.email);
	} catch (error) {
		console.error('[Email] Failed to send verification email:', error.message);
	}
}

/**
 * Send password reset link
 */
async function sendPasswordReset(user, token) {
	if (!resend) {
		console.log('[Email] Would send password reset email to:', user.email);
		console.log('[Email] Reset token:', token);
		return;
	}

	const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

	try {
		await resend.emails.send({
			from: FROM_EMAIL,
			to: user.email,
			subject: 'Reset your password - WCAG Monitor',
			html: `
				<h1>Reset Your Password</h1>
				<p>Hi ${user.name || 'there'},</p>
				<p>We received a request to reset your password. Click the button below to choose a new one:</p>
				<p>
					<a href="${resetUrl}" style="background-color: #228be6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						Reset Password
					</a>
				</p>
				<p>Or copy this link: ${resetUrl}</p>
				<p>This link expires in 1 hour.</p>
				<p>If you didn't request this, you can safely ignore this email.</p>
				<p>— The WCAG Monitor Team</p>
			`
		});
		console.log('[Email] Password reset email sent to:', user.email);
	} catch (error) {
		console.error('[Email] Failed to send password reset email:', error.message);
	}
}

/**
 * Send weekly report summary
 */
async function sendWeeklyReport(user, sites) {
	if (!resend) {
		console.log('[Email] Would send weekly report to:', user.email);
		return;
	}

	const totalIssues = sites.reduce((sum, site) => {
		const result = site.last_result;
		return sum + (result ? result.count.error + result.count.warning : 0);
	}, 0);

	const siteRows = sites.map(site => {
		const result = site.last_result;
		const score = result ? result.score : 'N/A';
		const errors = result ? result.count.error : 0;
		return `
			<tr>
				<td style="padding: 8px; border-bottom: 1px solid #eee;">${site.name}</td>
				<td style="padding: 8px; border-bottom: 1px solid #eee;">${score}</td>
				<td style="padding: 8px; border-bottom: 1px solid #eee;">${errors}</td>
			</tr>
		`;
	}).join('');

	try {
		await resend.emails.send({
			from: FROM_EMAIL,
			to: user.email,
			subject: `Weekly Accessibility Report - ${totalIssues} issues found`,
			html: `
				<h1>Weekly Accessibility Report</h1>
				<p>Hi ${user.name || 'there'},</p>
				<p>Here's your weekly accessibility summary:</p>
				<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
					<thead>
						<tr style="background-color: #f5f5f5;">
							<th style="padding: 12px; text-align: left;">Site</th>
							<th style="padding: 12px; text-align: left;">Score</th>
							<th style="padding: 12px; text-align: left;">Errors</th>
						</tr>
					</thead>
					<tbody>
						${siteRows}
					</tbody>
				</table>
				<p>
					<a href="${config.frontendUrl}/dashboard" style="background-color: #228be6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						View Full Report
					</a>
				</p>
				<p>— The WCAG Monitor Team</p>
			`
		});
		console.log('[Email] Weekly report sent to:', user.email);
	} catch (error) {
		console.error('[Email] Failed to send weekly report:', error.message);
	}
}

/**
 * Send error alert when new issues are found
 */
async function sendErrorAlert(user, site, newErrors) {
	if (!resend || !user.notifications?.alertOnError) {
		console.log('[Email] Would send error alert to:', user.email);
		return;
	}

	try {
		await resend.emails.send({
			from: FROM_EMAIL,
			to: user.email,
			subject: `⚠️ New accessibility errors on ${site.name}`,
			html: `
				<h1>New Accessibility Errors Detected</h1>
				<p>Hi ${user.name || 'there'},</p>
				<p>We found <strong>${newErrors} new errors</strong> on <strong>${site.name}</strong>.</p>
				<p>
					<a href="${config.frontendUrl}/dashboard/sites/${site.id}" style="background-color: #fa5252; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
						View Issues
					</a>
				</p>
				<p>— The WCAG Monitor Team</p>
				<p style="color: #888; font-size: 12px;">
					You're receiving this because you have error alerts enabled. 
					<a href="${config.frontendUrl}/dashboard/settings">Manage notification settings</a>
				</p>
			`
		});
		console.log('[Email] Error alert sent to:', user.email);
	} catch (error) {
		console.error('[Email] Failed to send error alert:', error.message);
	}
}

module.exports = {
	sendWelcome,
	sendVerification,
	sendPasswordReset,
	sendWeeklyReport,
	sendErrorAlert
};
