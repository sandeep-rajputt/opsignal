import sendMail from "../../../config/resend.js";
import { workspaceMemberAddedSubject } from "../../../emails/workspaceMemberAddedEmail.js";
import workspaceMemberAddedEmail from "../../../emails/workspaceMemberAddedEmail.js";
import type { WorkspaceMemberAddedJobPayload } from "../../../types/jobs/email/emailJobPayload.js";

type WorkspaceMemberAddedHandler = {
  from: string;
  to: string;
  emailType: WorkspaceMemberAddedJobPayload;
};

async function workspaceMemberAddedEmailHandler({
  from,
  to,
  emailType,
}: WorkspaceMemberAddedHandler) {
  try {
    await sendMail(
      from,
      to,
      workspaceMemberAddedSubject,
      workspaceMemberAddedEmail(emailType.params),
    );
  } catch (error) {
    console.error("Unable to send workspace member added email to : " + to);
  }
}

export default workspaceMemberAddedEmailHandler;
