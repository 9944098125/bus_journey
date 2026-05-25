import { getEmailFromAddress, getMailTransporter } from "../config/mailer.js";
export class EmailService {
    async sendFirstLoginEmail({ to, fullName, loginLink, role, }) {
        const transporter = getMailTransporter();
        const from = getEmailFromAddress();
        const appName = process.env.APP_NAME?.trim() || "Bus Journey";
        const roleLabel = role === "ADMIN" ? "admin" : "user";
        try {
            const result = await transporter.sendMail({
                from: `"${appName}" <${from}>`,
                to,
                subject: `Activate your ${appName} ${roleLabel} account`,
                text: [
                    `Hi ${fullName},`,
                    "",
                    `Thanks for registering as a ${roleLabel} on ${appName}.`,
                    "Click the link below to activate your account (first login only):",
                    "",
                    loginLink,
                    "",
                    "This link expires in 24 hours. If you did not register, you can ignore this email.",
                ].join("\n"),
                html: `
				<p>Hi ${fullName},</p>
				<p>Thanks for registering as a <strong>${roleLabel}</strong> on <strong>${appName}</strong>.</p>
				<p>Click the button below to activate your account. This link works for your first login only.</p>
				<p style="margin: 24px 0;">
					<a href="${loginLink}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block;">
						Activate account
					</a>
				</p>
				<p>Or copy this link into your browser:</p>
				<p><a href="${loginLink}">Activate your account</a></p>
				<p style="color:#6b7280;font-size:14px;">This link expires in 24 hours. If you did not register, you can ignore this email.</p>
			`,
            });
            console.log(`[email] Activation link sent to ${to} (messageId: ${result.messageId})`);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Unknown email error";
            throw new Error(`Failed to send activation email: ${message}`);
        }
    }
}
