import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export const getMailTransporter = (): Transporter => {
	if (transporter) {
		return transporter;
	}

	const host = process.env.SMTP_HOST?.trim();
	const port = Number(process.env.SMTP_PORT ?? 587);
	const user = process.env.SMTP_USER?.trim();
	const pass = process.env.SMTP_PASS?.trim();

	if (!host || !user || !pass) {
		throw new Error(
			"Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in .env",
		);
	}

	const isGmail =
		host.includes("gmail.com") || user.endsWith("@gmail.com");

	transporter = nodemailer.createTransport(
		isGmail
			? {
					service: "gmail",
					auth: { user, pass },
				}
			: {
					host,
					port,
					secure: process.env.SMTP_SECURE === "true",
					auth: { user, pass },
				},
	);

	return transporter;
};

export const getEmailFromAddress = (): string => {
	return (
		process.env.EMAIL_FROM?.trim() ||
		process.env.SMTP_USER?.trim() ||
		"no-reply@bus-journey.local"
	);
};
