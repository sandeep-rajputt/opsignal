import { Resend } from "resend";
import config from "./config.js";

const resend = new Resend(config.RESEND_API_KEY);

async function sendMail(
  from: string,
  to: string | string[],
  subject: string,
  html: string
) {
  await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

export default sendMail;
