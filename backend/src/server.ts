import app from "./app.js";
import config from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/user.routes.js";
import "./jobs/workers/start-workers.js";

const { PORT } = config;

app.use("/api/user", userRouter);

app.get("/status", (_req, res) => {
  res.status(200).json({
    message: "OK",
    success: true,
    timeStamp: Date.now(),
  });
});

app.listen(PORT, () => {
  console.log("Server is running on PORT : " + PORT);
});

app.use(globalErrorHandler);

export default app;
