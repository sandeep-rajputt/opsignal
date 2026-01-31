import { Worker } from "bullmq";
import { workerOptions } from "../../config/bullmq.js";
import { query } from "../../config/db.js";

const pingDbWorker = new Worker(
  "ping-db",
  async () => {
    const start = performance.now();
    await query("SELECT 1");
    const ms = performance.now() - start;

    if (ms > 3000) {
      console.log(`❄️ PostgreSQL cold start (${ms.toFixed(0)} ms)`);
    }
  },
  workerOptions,
);

export default pingDbWorker;
