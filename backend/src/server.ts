import app from "./app.js";
import config from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/user.routes.js";
import "./jobs/workers/start-workers.js";

const { PORT } = config;

/**
 * Routes
 */
app.use("/api/user", userRouter);

app.get("/status", (_req, res) => {
  res.status(200).json({
    message: "OK",
    success: true,
    timeStamp: Date.now(),
  });
});

/**
 * Global error handler MUST be before listen
 */
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});

export default app;
