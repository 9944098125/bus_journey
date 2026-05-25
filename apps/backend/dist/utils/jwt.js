import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET ?? "bus-journey-dev-secret";
const signOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d"),
};
export const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, signOptions);
};
