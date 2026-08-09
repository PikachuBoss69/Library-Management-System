import { Router } from "express";

import * as dashboardController from "../controllers/Dashboard.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeMiddleware } from "../middleware/authorize.middleware";
import { Roles } from "../constants/roles";

const router = Router();

router.use(authMiddleware);

router.get(
    "/student",
    authorizeMiddleware(Roles.STUDENT),
    dashboardController.getStudentDashboard
);

router.get(
    "/librarian",
    authorizeMiddleware(Roles.LIBRARIAN),
    dashboardController.getLibrarianDashboard
);

router.get(
    "/admin",
    authorizeMiddleware(Roles.ADMIN),
    dashboardController.getAdminDashboard
);

export default router;