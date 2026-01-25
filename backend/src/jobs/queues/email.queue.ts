import { Queue } from "bullmq";
import { queueOptions } from "../../config/bullmq.js";
import { type EmailJobPayload } from "../../types/jobs/email/emailJobPayload.js";

export const emailQueueName = "email-queue";

const emailQueue = new Queue<EmailJobPayload>(emailQueueName, queueOptions);

export async function enqueueEmail(payload: EmailJobPayload) {
  await emailQueue.add("send-email", payload, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}

export default enqueueEmail;
