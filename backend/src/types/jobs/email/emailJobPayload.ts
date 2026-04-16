import type { VerifyEmail } from "../../../emails/verifyEmail.js";
import type { ResetPassword } from "../../../emails/resetPasswordEmail.js";
import type { WorkspaceMemberAdded } from "../../../emails/workspaceMemberAddedEmail.js";
import type { TeamMemberAdded } from "../../../emails/teamMemberAddedEmail.js";

export type EmailJobPayload = {
  from: string;
  to: string;
  emailType: JobPayloadEmailType;
};

export type JobPayloadEmailType =
  | VerifyEmailJobPayload
  | ResetPasswordEmailJobPayload
  | WorkspaceMemberAddedJobPayload
  | TeamMemberAddedJobPayload;

export type VerifyEmailJobPayload = {
  name: "verifyEmail";
  params: VerifyEmail;
};

export type ResetPasswordEmailJobPayload = {
  name: "resetPasswordEmail";
  params: ResetPassword;
};

export type WorkspaceMemberAddedJobPayload = {
  name: "workspaceMemberAdded";
  params: WorkspaceMemberAdded;
};

export type TeamMemberAddedJobPayload = {
  name: "teamMemberAdded";
  params: TeamMemberAdded;
};
