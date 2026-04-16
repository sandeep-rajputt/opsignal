import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import type { ROLE } from "../../rbac/roles.js";
import addWorkspaceMemberModel from "../model/addWorkspaceMember.model.js";
import {
  checkUserExistsAndSlotsModel,
  checkMemberExistsModel,
  checkTeamBelongsToWorkspaceModel,
} from "../model/addTeamMember.model.js";
import reactivateMemberIfDeletedModel from "../model/checkMemberExistsIncludingDeleted.model.js";
import enqueueEmail from "../../jobs/queues/email.queue.js";

/**
 * Service for adding workspace members with validation
 */
export async function addWorkspaceMemberService({
  workspaceId,
  requestingUserId,
  email,
  role,
  teamId,
}: {
  workspaceId: string;
  requestingUserId: string;
  email: string;
  role: ROLE;
  teamId: string;
}): Promise<{ success: boolean; message: string }> {
  // Check if requesting user has permission to add workspace members
  const canAddMembers = await checkPermission({
    userId: requestingUserId,
    workspaceId,
    permission: Permission.ADD_WORKSPACE_MEMBER,
  });

  if (!canAddMembers) {
    throw new Error("Insufficient permissions to add workspace members");
  }

  // Check if team belongs to workspace
  const teamBelongsToWorkspace = await checkTeamBelongsToWorkspaceModel({
    teamId,
    workspaceId,
  });

  if (!teamBelongsToWorkspace) {
    throw new Error("Team does not belong to this workspace");
  }

  // Check if user exists and get their slots
  const userCheck = await checkUserExistsAndSlotsModel(email);

  if (!userCheck.exists) {
    throw new Error("User does not exist");
  }

  const { userId, name, slots, currentWorkspaces } = userCheck;

  // Check if user is already a member
  const isMember = await checkMemberExistsModel({
    userId: userId!,
    workspaceId,
  });

  if (isMember) {
    throw new Error("User is already a member of this workspace");
  }

  // Check workspace slot limit
  if (currentWorkspaces! >= slots!) {
    throw new Error("User has reached maximum workspace limit");
  }

  // Try to reactivate if member was previously deleted
  const reactivation = await reactivateMemberIfDeletedModel({
    userId: userId!,
    workspaceId,
    teamId,
    role,
  });

  if (reactivation.wasReactivated) {
    // Member was reactivated, send email and return success
    try {
      await enqueueEmail({
        from: "Opsignal <i@opsignal.sandeeprajput.in>",
        to: email,
        emailType: {
          name: "workspaceMemberAdded",
          params: {
            name: name!,
            workspaceId,
            role,
          },
        },
      });
    } catch (error) {
      console.error("Failed to send member added email:", error);
    }

    return {
      success: true,
      message: "Member added successfully",
    };
  }

  // Add new member to workspace
  const result = await addWorkspaceMemberModel({
    userId: userId!,
    workspaceId,
    teamId,
    role,
    invitedBy: requestingUserId,
  });

  if (!result.success) {
    throw new Error("Failed to add member");
  }

  // Send email notification
  try {
    await enqueueEmail({
      from: "Opsignal <i@opsignal.sandeeprajput.in>",
      to: email,
      emailType: {
        name: "workspaceMemberAdded",
        params: {
          name: name!,
          workspaceId,
          role,
        },
      },
    });
  } catch (error) {
    console.error("Failed to send member added email:", error);
    // Don't fail the request if email fails
  }

  return {
    success: true,
    message: "Member added successfully",
  };
}
