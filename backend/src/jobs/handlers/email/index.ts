import verifyEmailHandler from "./verifyEmailHandler.js";
import { type EmailJobPayload } from "../../../types/jobs/email/emailJobPayload.js";

async function emailHandler(job: EmailJobPayload) {
  const name = job.emailType.name;
  switch (name) {
    case "verifyEmail":
      await verifyEmailHandler(job);
  }
}

export default emailHandler;
