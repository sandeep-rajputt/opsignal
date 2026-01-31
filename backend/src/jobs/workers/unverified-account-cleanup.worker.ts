import { Job, Worker } from "bullmq";
import type { JobPayload } from "../queues/unverified-account-cleanup.queue.js";
import { workerOptions } from "../../config/bullmq.js";
import { unverifiedAccountCleanupQueueName } from "../queues/unverified-account-cleanup.queue.js";
import unverifiedAccountCleanupHandler from "../handlers/unverified-account-cleanup.handler.js";

const accountCleanupWorker = new Worker<JobPayload>(
  unverifiedAccountCleanupQueueName,
  async function (_job: Job<JobPayload>) {
    try {
      console.log("running cleanup");
      await unverifiedAccountCleanupHandler();
    } catch (error) {
      console.log(error);
      console.error("Unable to cleanup accounts, at: " + new Date());
    }
  },
  workerOptions,
);

console.log(
  "✅ Unverified account cleanup worker started and listening for jobs",
);

export default accountCleanupWorker;
