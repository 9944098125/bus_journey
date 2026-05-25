const DEFAULT_FRONTEND_URL = "http://localhost:3000";
export const buildFirstLoginLink = (token) => {
    const baseUrl = (process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL).replace(/\/$/, "");
    return `${baseUrl}/login?token=${encodeURIComponent(token)}`;
};
