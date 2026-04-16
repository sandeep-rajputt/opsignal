import verifyEmailHandler from "./verifyEmailHandler.js";
import { type EmailJobPayload } from "../../../types/jobs/email/emailJobPayload.js";
import resetPasswordEmailHandler from "./resetPasswordEmailHandler.js";
import workspaceMemberAddedEmailHandler from "./workspaceMemberAddedEmailHandler.js";
import teamMemberAddedEmailHandler from "./teamMemberAddedEmailHandler.js";
import type {
  VerifyEmailJobPayload,
  ResetPasswordEmailJobPayload,
  WorkspaceMemberAddedJobPayload,
  TeamMemberAddedJobPayload,
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
      break;
    case "workspaceMemberAdded":
      await workspaceMemberAddedEmailHandler({
        from: job.from,
        to: job.to,
        emailType: job.emailType as WorkspaceMemberAddedJobPayload,
      });
      break;
    case "teamMemberAdded":
      await teamMemberAddedEmailHandler({
        from: job.from,
        to: job.to,
        emailType: job.emailType as TeamMemberAddedJobPayload,
      });
      break;
  }
}

export default emailHandler;
