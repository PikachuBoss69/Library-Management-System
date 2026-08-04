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

router.post(
    "/:bookId/copies",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.createBookCopySchema),
    bookManagementController.addBookCopies 
);

router.get(
    "/:bookId/copies",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.getBookCopiesSchema),
    bookManagementController.getAllBookCopies 
);


router.get(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.getBookCopySchema),
    bookManagementController.getBookCopyDetails 
);
router.patch(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.updateBookCopySchema),
    bookManagementController.updateBookCopy
);


router.delete(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookValidation.deleteBookCopySchema),
    bookManagementController.deleteBookCopy 
);


export default router;