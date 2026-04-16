import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import { ROLE } from "../../rbac/roles.js";
import addTeamMemberModel, {
  checkUserExistsAndSlotsModel,
  checkMemberExistsModel,
  checkTeamBelongsToWorkspaceModel,
} from "../model/addTeamMember.model.js";
import getMemberRoleModel from "../model/getMemberRole.model.js";
import checkUserBelongsToTeamModel from "../model/checkUserTeam.model.js";
import reactivateMemberIfDeletedModel from "../model/checkMemberExistsIncludingDeleted.model.js";
import enqueueEmail from "../../jobs/queues/email.queue.js";

/**
 * Service for adding team members with validation
 * OWNER/ADMIN can add to any team, MODERATOR can only add to their own team
 */
export async function addTeamMemberService({
  workspaceId,
  requestingUserId,
  email,
  teamId,
}: {
  workspaceId: string;
  requestingUserId: string;
  email: string;
  teamId: string;
}): Promise<{ success: boolean; message: string }> {
  // Check if requesting user has permission to add team members
  const canAddTeamMembers = await checkPermission({
    userId: requestingUserId,
    workspaceId,
    permission: Permission.ADD_TEAM_MEMBER,
  });

  if (!canAddTeamMembers) {
    throw new Error("Insufficient permissions to add team members");
  }

  // Check if team belongs to workspace
  const teamBelongsToWorkspace = await checkTeamBelongsToWorkspaceModel({
    teamId,
    workspaceId,
  });

  if (!teamBelongsToWorkspace) {
    throw new Error("Team does not belong to this workspace");
  }

  // Get requesting user's role
  const requestingUserRole = await getMemberRoleModel({
    userId: requestingUserId,
    workspaceId,
  });

  // If user is MODERATOR, check if they belong to the team they're adding to
  if (requestingUserRole === ROLE.MODERATOR) {
    const belongsToTeam = await checkUserBelongsToTeamModel({
      userId: requestingUserId,
      teamId,
      workspaceId,
    });

    if (!belongsToTeam) {
      throw new Error("Moderators can only add members to their own team");
    }
  }
  // OWNER and ADMIN can add to any team (no additional check needed)

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
    role: "member",
  });

  if (reactivation.wasReactivated) {
    // Member was reactivated, send email and return success
    try {
      await enqueueEmail({
        from: "Opsignal <i@opsignal.sandeeprajput.in>",
        to: email,
        emailType: {
          name: "teamMemberAdded",
          params: {
            name: name!,
            workspaceId,
            teamId,
          },
        },
      });
    } catch (error) {
      console.error("Failed to send team member added email:", error);
    }

    return {
      success: true,
      message: "Team member added successfully",
    };
  }

  // Add member to team
  const result = await addTeamMemberModel({
    userId: userId!,
    workspaceId,
    teamId,
    invitedBy: requestingUserId,
  });

  if (!result.success) {
    throw new Error("Failed to add team member");
  }

  // Send email notification
  try {
    await enqueueEmail({
      from: "Opsignal <i@opsignal.sandeeprajput.in>",
      to: email,
      emailType: {
        name: "teamMemberAdded",
        params: {
          name: name!,
          workspaceId,
          teamId,
        },
      },
    });
  } catch (error) {
    console.error("Failed to send team member added email:", error);
    // Don't fail the request if email fails
  }

  return {
    success: true,
    message: "Team member added successfully",
  };
}
