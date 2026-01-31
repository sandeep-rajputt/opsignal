import express from "express";
import cors from "cors";
import env from "./config/config.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigin = env.FRONTEND_URL;

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true);

    if (allowedOrigin === origin) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", true);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

export default app;
