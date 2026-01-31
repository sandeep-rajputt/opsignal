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

export default async function removeUnverifiedAccount() {
  console.log("Start unverified account clean up");
  try {
    const job = await cleanupQueue.add(
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
    console.log("✅ Cleanup job added successfully:", job.id);
  } catch (error) {
    console.error("❌ Failed to add cleanup job:", error);
  }
}
