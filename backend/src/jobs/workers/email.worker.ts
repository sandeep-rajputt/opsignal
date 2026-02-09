import { Worker, Job } from "bullmq";
import { workerOptions } from "../../config/bullmq.js";
import { emailQueueName } from "../queues/email.queue.js";
import emailHandler from "../handlers/email/index.js";
import { type EmailJobPayload } from "../../types/jobs/email/emailJobPayload.js";

const emailWorker = new Worker<EmailJobPayload>(
  emailQueueName,
  async (job: Job<EmailJobPayload>) => {
    await emailHandler(job.data);
  },
  workerOptions,
);

console.log("✅ Email worker started and listening for jobs");

export default emailWorker;
