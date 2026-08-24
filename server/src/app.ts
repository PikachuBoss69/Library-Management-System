import express   from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/AppError.middleware";
import authRoutes from "./routes/auth.route";
import bookManagementRoutes from "./routes/bookManagement.route";
import borrowRoutes from "./routes/borrow.route";
import bookCopyRoutes from './routes/bookCopy.route';
import fineRoutes from './routes/fine.route';
import  DashboardRoutes  from "./routes/dashboard.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/book", bookManagementRoutes);
app.use("/api/bookCopy", bookCopyRoutes);
app.use("/api/fine", fineRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/borrow", borrowRoutes);

// Error handler should be LAST
app.use(errorHandler);

export default app;