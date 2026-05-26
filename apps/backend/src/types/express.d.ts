import type { IUser } from "../interfaces/user.interface.js";
import type { JwtPayload } from "../utils/jwt.js";

declare global {
	namespace Express {
		interface Request {
			firstLoginUser?: IUser;
			user?: IUser;
			auth?: JwtPayload;
		}
	}
}

export {};
