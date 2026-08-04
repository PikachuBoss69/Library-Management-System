// This file is used to extend the Express Request interface with a custom property `user` of type `IUserDocument`.
import { IUserDocument } from "../models/users.model";

declare global {

    namespace Express {

        interface Request {
            
            user?: IUserDocument;
        }
    }

}

export {};