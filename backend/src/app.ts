import express from "express";
import cors from "cors";
import env from "./config/config.js";

const app = express();

const allowedOrigins = env.FRONTEND_URL.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", true);

export default app;
