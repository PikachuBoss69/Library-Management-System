import { IUserDocument } from "../models/users.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
        }
    }
}

export {};