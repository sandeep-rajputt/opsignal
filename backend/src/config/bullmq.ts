import config from "./config.js";
import type { QueueOptions, WorkerOptions } from "bullmq";

export const connection = { url: config.BULL_REDIS_URL || config.REDIS_URL };

export const queueOptions: QueueOptions = { connection };
export const workerOptions: WorkerOptions = { connection };
