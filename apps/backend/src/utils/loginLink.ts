const DEFAULT_FRONTEND_URL = "http://localhost:5173";

export const buildFirstLoginLink = (token: string): string => {
	const baseUrl = (
		process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL
	).replace(/\/$/, "");

	return `${baseUrl}/login?token=${encodeURIComponent(token)}`;
};
