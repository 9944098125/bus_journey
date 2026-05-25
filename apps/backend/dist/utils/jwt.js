import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET ?? "bus-journey-dev-secret";
const signOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d"),
};
const firstLoginSignOptions = {
    expiresIn: (process.env.FIRST_LOGIN_TOKEN_EXPIRES_IN ??
        "24h"),
};
export const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, signOptions);
};
export const signFirstLoginToken = (payload) => {
    return jwt.sign({ ...payload, purpose: "first_login" }, JWT_SECRET, firstLoginSignOptions);
};
export const verifyFirstLoginToken = (token) => {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "first_login") {
        throw new Error("Invalid login link token");
    }
    return decoded;
};
