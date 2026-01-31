import sendMail from "../../../config/resend.js";
import { resetPasswordSubject } from "../../../emails/resetPasswordEmail.js";
import resetPasswordEmail from "../../../emails/resetPasswordEmail.js";
import type { ResetPasswordEmailJobPayload } from "../../../types/jobs/email/emailJobPayload.js";

type resetPasswordEmailHandler = {
  from: string;
  to: string;
  emailType: ResetPasswordEmailJobPayload;
};

async function resetPasswordEmailHandler({
  from,
  to,
  emailType,
}: resetPasswordEmailHandler) {
  try {
    await sendMail(
      from,
      to,
      resetPasswordSubject,
      resetPasswordEmail({ link: emailType.params.link }),
    );
  } catch (error) {
    console.error("Unable to send verify email to : " + to);
  }
}

export default resetPasswordEmailHandler;
