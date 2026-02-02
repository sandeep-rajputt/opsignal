import verifyEmailHandler from "./verifyEmailHandler.js";
import { type EmailJobPayload } from "../../../types/jobs/email/emailJobPayload.js";
import resetPasswordEmailHandler from "./resetPasswordEmailHandler.js";
import type {
  VerifyEmailJobPayload,
  ResetPasswordEmailJobPayload,
} from "../../../types/jobs/email/emailJobPayload.js";

async function emailHandler(job: EmailJobPayload) {
  switch (job.emailType.name) {
    case "verifyEmail":
      await verifyEmailHandler({
        from: job.from,
        to: job.to,
        emailType: job.emailType,
      });
      break;
    case "resetPasswordEmail":
      await resetPasswordEmailHandler({
        from: job.from,
        to: job.to,
        emailType: job.emailType as ResetPasswordEmailJobPayload,
      });
  }
}

export default emailHandler;
