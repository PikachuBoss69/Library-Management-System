import { Router } from "express";

import * as fineController from "../controllers/fine.controller";

import { validate } from "../middleware/ValidateRequest.middleware";
import {authMiddleware} from "../middleware/auth.middleware";
import {authorizeMiddleware} from "../middleware/authorize.middleware";
import {
    getFineByBorrowIdSchema,
    getPendingFinesSchema,
    getFineHistorySchema,
    waiveFineSchema,
    payFineByCashSchema,
    payFineByUPISchema,
} from "../validators/fine.validation";
import {Roles} from '../constants/roles';

const router = Router();

router.use(authMiddleware);

router.get(
    "/borrow/:borrowId",
    validate(getFineByBorrowIdSchema),
    fineController.getFineByBorrowId
);

router.get(
    "/pending",
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
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
    authorizeMiddleware(Roles.ADMIN),
    validate(waiveFineSchema),
    fineController.fineWaived
);

router.patch(
    "/pay/cash/:fineId",
    authorizeMiddleware(Roles.ADMIN, Roles.LIBRARIAN),
    validate(payFineByCashSchema),
    fineController.payFineByCash
);

router.post(
    "/pay/upi/:fineId",
    validate(payFineByUPISchema),
    fineController.payFineByUPI
);


export default router;