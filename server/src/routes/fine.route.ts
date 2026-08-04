import { Router } from "express";

import * as fineController from "../controllers/fine.controller";

import { validate } from "../middleware/ValidateRequest.middleware";

import {
    getFineByBorrowIdSchema,
    getPendingFinesSchema,
    getFineHistorySchema,
    waiveFineSchema,
    payFineByCashSchema,
    payFineByUPISchema,
} from "../validators/fine.validation";

const router = Router();

router.get(
    "/borrow/:borrowId",
    validate(getFineByBorrowIdSchema),
    fineController.getFineByBorrowId
);

router.get(
    "/pending",
    validate(getPendingFinesSchema),
    fineController.getAllPendingFines
);

router.get(
    "/history",
    validate(getFineHistorySchema),
    fineController.getFineHistory
);

router.patch(
    "/:fineId/waive",
    validate(waiveFineSchema),
    fineController.fineWaived
);

router.patch(
    "/:fineId/pay/cash",
    validate(payFineByCashSchema),
    fineController.payFineByCash
);

router.post(
    "/:fineId/pay/upi",
    validate(payFineByUPISchema),
    fineController.payFineByUPI
);

export default router;