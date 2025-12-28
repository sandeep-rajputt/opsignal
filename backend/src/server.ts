import app from "./app.js";
import config from "./config/config.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
const { PORT } = config;

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
