import type { VerifyEmail } from "../../../emails/verifyEmail.js";
import type { ResetPassword } from "../../../emails/resetPasswordEmail.js";

export type EmailJobPayload = {
  from: string;
  to: string;
  emailType: JobPayloadEmailType;
};

export type JobPayloadEmailType =
  | VerifyEmailJobPayload
  | ResetPasswordEmailJobPayload;

export type VerifyEmailJobPayload = {
  name: "verifyEmail";
  params: VerifyEmail;
};

export type ResetPasswordEmailJobPayload = {
  name: "resetPasswordEmail";
  params: ResetPassword;
};
