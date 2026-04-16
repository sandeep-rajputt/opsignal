import sendMail from "../../../config/resend.js";
import { teamMemberAddedSubject } from "../../../emails/teamMemberAddedEmail.js";
import teamMemberAddedEmail from "../../../emails/teamMemberAddedEmail.js";
import type { TeamMemberAddedJobPayload } from "../../../types/jobs/email/emailJobPayload.js";

type TeamMemberAddedHandler = {
  from: string;
  to: string;
  emailType: TeamMemberAddedJobPayload;
};

async function teamMemberAddedEmailHandler({
  from,
  to,
  emailType,
}: TeamMemberAddedHandler) {
  try {
    await sendMail(
      from,
      to,
      teamMemberAddedSubject,
      teamMemberAddedEmail(emailType.params),
    );
  } catch (error) {
    console.error("Unable to send team member added email to : " + to);
  }
}

export default teamMemberAddedEmailHandler;
