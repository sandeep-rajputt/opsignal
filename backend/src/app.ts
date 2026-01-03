import express from "express";

const app = express();

app.use(express.json());
app.set("trust proxy", true);

export default app;
