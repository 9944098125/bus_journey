import type { IUser } from "../interfaces/user.interface.js";

declare global {
	namespace Express {
		interface Request {
			firstLoginUser?: IUser;
		}
	}
}

export {};
