import express from "express";

import * as bookCopyController from "../controllers/bookCopies.controller";
import * as bookCopyValidation from "../validators/bookCopy.validation";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize.middleware";
import { Roles } from "../constants/roles";
import {validate} from "../middleware/ValidateRequest.middleware";

const router = express.Router();

router.post(
    "/bulk/copies",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.addBulkCopiesSchema),
    bookCopyController.addBulkCopies 
);


router.post(
    "/copies",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.bookCopySchema),
    bookCopyController.addBookCopies 
);

router.get(
    "/copies/details/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.getBookCopySchema),
    bookCopyController.getBookCopyDetails 
);
router.patch(
    "/copies/update/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.updateBookCopySchema),
    bookCopyController.updateBookCopy
);


router.delete(
    "/copies/delete/:copyId",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(bookCopyValidation.deleteBookCopySchema),
    bookCopyController.deleteBookCopy 
);


export default router;