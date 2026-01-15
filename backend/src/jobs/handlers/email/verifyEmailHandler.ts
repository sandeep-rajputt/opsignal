import sendMail from "../../../config/resend.js";
import {
  type VerifyEmail,
  verifyEmailSubject,
} from "../../../emails/verifyEmail.js";
import verifyEmail from "../../../emails/verifyEmail.js";

type VerifyEmailHandler = {
  from: string;
  to: string;
  emailType: {
    name: "verifyEmail";
    params: VerifyEmail;
  };
};

async function verifyEmailHandler({ from, to, emailType }: VerifyEmailHandler) {
  try {
    console.log("Finally Sending email...");
    await sendMail(
      from,
      to,
      verifyEmailSubject,
      verifyEmail({ link: emailType.params.link })
    );
    console.log("Sucessfully Email Sent");
  } catch (error) {
    console.error("Unable to send verify email to : " + to);
  }
}

export default verifyEmailHandler;
