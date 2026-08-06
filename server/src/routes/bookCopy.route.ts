import express from "express";

import * as bookCopyController from "../controllers/bookCopies.controller";
import * as bookCopyValidation from "../validators/bookCopy.validation";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize.middleware";
import { Roles } from "../constants/roles";
import {validate} from "../middleware/ValidateRequest.middleware";

const router = express.Router();


router.post(
    "/:bookId/copies",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.createBookCopySchema),
    bookCopyController.addBookCopies 
);

router.get(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.getBookCopySchema),
    bookCopyController.getBookCopyDetails 
);
router.patch(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.updateBookCopySchema),
    bookCopyController.updateBookCopy
);


router.delete(
    "/:bookId/copies/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.deleteBookCopySchema),
    bookCopyController.deleteBookCopy 
);


export default router;