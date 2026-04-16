"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE } from "@/rbac/roles";
import canUpdateMemberRole, {
  getAvailableRoles,
} from "@/lib/canUpdateMemberRole";

interface Member {
  id: string;
  role: "owner" | "admin" | "moderator" | "member";
  joined_at: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  team_id: string | null;
}

interface MemberCardProps {
  member: Member;
  currentUserRole: ROLE | string;
  currentUserId?: string;
  onRemove: (memberId: string) => void;
  onRoleUpdate: (memberId: string, newRole: ROLE) => void;
  canRemove: boolean;
  isUpdatingRole?: boolean;
}

export function MemberCard({
  member,
  currentUserRole,
  currentUserId,
  onRemove,
  onRoleUpdate,
  canRemove,
  isUpdatingRole = false,
}: MemberCardProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState<ROLE | null>(null);

  const handleRemoveClick = () => {
    setShowRemoveDialog(true);
  };

  const handleConfirmRemove = () => {
    onRemove(member.user_id);
    setShowRemoveDialog(false);
  };

  const handleRoleChange = (newRole: string) => {
    setPendingRole(newRole as ROLE);
    setShowRoleChangeDialog(true);
  };

  const handleConfirmRoleChange = () => {
    if (pendingRole) {
      onRoleUpdate(member.user_id, pendingRole);
    }
    setShowRoleChangeDialog(false);
    setPendingRole(null);
  };

  const handleCancelRoleChange = () => {
    setShowRoleChangeDialog(false);
    setPendingRole(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "destructive";
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      case "member":
        return "outline";
      default:
        return "outline";
    }
  };

  const canUpdate = canUpdateMemberRole(
    currentUserRole,
    member.role,
    currentUserId,
    member.user_id,
  );
  const availableRoles = getAvailableRoles(currentUserRole, member.role);

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-4">
          <Avatar>
            {member.avatar_url ? (
              <AvatarImage src={member.avatar_url} alt={member.name} />
            ) : (
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{member.name}</span>
              {canUpdate && availableRoles.length > 0 ? (
                <Select
                  value={member.role}
                  onValueChange={handleRoleChange}
                  disabled={isUpdatingRole}
                >
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={member.role}>
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role}
                      </Badge>
                    </SelectItem>
                    {availableRoles
                      .filter((role) => role !== member.role)
                      .map((role) => (
                        <SelectItem key={role} value={role}>
                          <Badge variant={getRoleBadgeVariant(role)}>
                            {role}
                          </Badge>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role}
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {member.email}
            </span>
            {member.team_id && (
              <span className="text-xs text-muted-foreground">
                Team ID: {member.team_id}
              </span>
            )}
          </div>
        </div>

        {canRemove && (
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={handleRemoveClick}
            aria-label={`Remove ${member.name}`}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {member.name} from the workspace?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showRoleChangeDialog}
        onOpenChange={setShowRoleChangeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to change {member.name}&apos;s role from{" "}
              <span className="font-semibold">{member.role}</span> to{" "}
              <span className="font-semibold">{pendingRole}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelRoleChange}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRoleChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
