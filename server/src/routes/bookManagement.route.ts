import express from "express";

import * as bookManagementController from "../controllers/bookManagement.controller";
import * as bookValidation from "../validators/book.validation";

import {validate} from "../middleware/ValidateRequest.middleware";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                  BOOKS                                     */
/* -------------------------------------------------------------------------- */

router.post(
    "/",
    validate(bookValidation.createBookSchema),
    bookManagementController.addNewBook 
);

router.get(
    "/:bookId",
    validate(bookValidation.getBookSchema),
    bookManagementController.getBookDetails 
);

router.get(
    "/",
    validate(bookValidation.getAllBooksSchema),
    bookManagementController.getAllBook 
);


router.patch(
    "/:bookId",
    validate(bookValidation.updateBookSchema),
    bookManagementController.updateBook 
);


router.delete(
    "/:bookId",
    validate(bookValidation.deleteBookSchema),
    bookManagementController.deleteBook 
);

/* -------------------------------------------------------------------------- */
/*                               BOOK COPIES                                  */
/* -------------------------------------------------------------------------- */

router.post(
    "/:bookId/copies",
    validate(bookValidation.createBookCopySchema),
    bookManagementController.addBookCopies 
);

router.get(
    "/:bookId/copies",
    validate(bookValidation.getBookCopiesSchema),
    bookManagementController.getAllBookCopies 
);


router.get(
    "/:bookId/copies/:copyId",
    validate(bookValidation.getBookCopySchema),
    bookManagementController.getBookCopyDetails 
);
router.patch(
    "/:bookId/copies/:copyId",
    validate(bookValidation.updateBookCopySchema),
    bookManagementController.updateBookCopy
);


router.delete(
    "/:bookId/copies/:copyId",
    validate(bookValidation.deleteBookCopySchema),
    bookManagementController.deleteBookCopy 
);


export default router;