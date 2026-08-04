import express from "express";

import * as borrowController from "../controllers/borrow.controller";
import * as borrowValidation from "../validators/borrow.validation";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize.middleware";
import {validate} from "../middleware/ValidateRequest.middleware";

import { Roles } from "../constants/roles";


const router = express.Router();

router.post(
    "/borrow",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(borrowValidation.borrowBookSchema),
    borrowController.borrowBook
);

router.post(
    "/return",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(borrowValidation.returnBookSchema),
    borrowController.returnBook
);

router.post(
    "/report-lost",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(borrowValidation.reportLostBookSchema),
    borrowController.reportLostBook
);

router.get(
    "/:borrowId",
    authMiddleware,
    validate(borrowValidation.getBorrowRecordSchema),
    borrowController.getBorrowRecordById
);

router.get(
    "/my",
    authMiddleware,
    validate(borrowValidation.getMyBorrowedBooksSchema),
    borrowController.getMyBorrowedBooks
);

router.get(
    "/history",
    authMiddleware,
    validate(borrowValidation.getBorrowHistorySchema),
    borrowController.getMyBorrowHistory
);

router.get(
    "/all",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(borrowValidation.getAllBorrowedBooksSchema),
    borrowController.getAllBorrowedBooks
);

router.get(
    "/overdue",
    authMiddleware,
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(borrowValidation.getOverdueBooksSchema),
    borrowController.getOverdueBooks
);
export default router;