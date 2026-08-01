import express from "express";

import * as borrowController from "../controllers/borrow.controller";
import * as borrowValidation from "../validators/borrow.validation";

import {validate} from "../middleware/ValidateRequest.middleware";


const router = express.Router();

router.post(
    "/borrow",
    validate(borrowValidation.borrowBookSchema),
    borrowController.borrowBook
);

router.post(
    "/return",
    validate(borrowValidation.returnBookSchema),
    borrowController.returnBook
);

router.post(
    "/report-lost",
    validate(borrowValidation.reportLostBookSchema),
    borrowController.reportLostBook
);

router.get(
    "/:borrowId",
    validate(borrowValidation.getBorrowRecordSchema),
    borrowController.getBorrowRecordById
);

router.get(
    "/my",
    validate(borrowValidation.getMyBorrowedBooksSchema),
    borrowController.getMyBorrowedBooks
);

router.get(
    "/history",
    validate(borrowValidation.getBorrowHistorySchema),
    borrowController.getMyBorrowHistory
);

export default router;