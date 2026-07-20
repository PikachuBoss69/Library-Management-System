import express   from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/AppError.middleware";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);

// Error handler should be LAST
app.use(errorHandler);

export default app;