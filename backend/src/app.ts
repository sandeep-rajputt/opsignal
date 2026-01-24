import express from "express";
import cors from "cors";
import env from "./config/config.js";

const app = express();

const allowedOrigins = env.FRONTEND_URL.split(",");

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
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

app.use(express.json());

export default app;
