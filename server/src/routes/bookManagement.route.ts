import express from "express";

import * as bookManagementController from "../controllers/bookManagement.controller";
import * as bookValidation from "../validators/book.validation";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize.middleware";
import { Roles } from "../constants/roles";
import {validate} from "../middleware/ValidateRequest.middleware";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.createBookSchema),
    bookManagementController.addNewBook 
);

router.get(
    "/:bookId",
    authMiddleware,
    validate(bookValidation.getBookSchema),
    bookManagementController.getBookDetails 
);

router.get(
    "/",
    authMiddleware,
    validate(bookValidation.getAllBooksSchema),
    bookManagementController.getAllBook 
);


router.patch(
    "/:bookId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.updateBookSchema),
    bookManagementController.updateBook 
);


router.delete(
    "/:bookId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.deleteBookSchema),
    bookManagementController.deleteBook 
);




export default router;