import { Queue } from "bullmq";
import { queueOptions } from "../../config/bullmq.js";

export type JobPayload = {
  source: "corn";
};

export const unverifiedAccountCleanupQueueName =
  "unverified-account-cleanup-queue";

const cleanupQueue = new Queue<JobPayload>(
  unverifiedAccountCleanupQueueName,
  queueOptions,
);

export default async function () {
  await cleanupQueue.add(
    "cleanup-job",
    { source: "corn" },
    {
      repeat: {
        every: 30 * 60 * 1000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    },
  );
}
