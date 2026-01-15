import type { VerifyEmail } from "../emails/verifyEmail.js";

export type EmailJobPayload = {
  from: string;
  to: string;
  emailType: VerifyEmailJobPayload;
};

type VerifyEmailJobPayload = {
  name: "verifyEmail";
  params: VerifyEmail;
};
