import sendMail from "../../../config/resend.js";
import { verifyEmailSubject } from "../../../emails/verifyEmail.js";
import verifyEmail from "../../../emails/verifyEmail.js";
import type { VerifyEmailJobPayload } from "../../../types/jobs/email/emailJobPayload.js";

type VerifyEmailHandler = {
  from: string;
  to: string;
  emailType: VerifyEmailJobPayload;
};

async function verifyEmailHandler({ from, to, emailType }: VerifyEmailHandler) {
  try {
    await sendMail(
      from,
      to,
      verifyEmailSubject,
      verifyEmail({ link: emailType.params.link }),
    );
  } catch (error) {
    console.error("Unable to send verify email to : " + to);
  }
}

export default verifyEmailHandler;
