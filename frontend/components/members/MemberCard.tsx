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
import { ROLE } from "@/rbac/roles";

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
  onRemove: (memberId: string) => void;
  canRemove: boolean;
}

export function MemberCard({
  member,
  currentUserRole,
  onRemove,
  canRemove,
}: MemberCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleRemoveClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    onRemove(member.id);
    setShowConfirmDialog(false);
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
              <Badge variant={getRoleBadgeVariant(member.role)}>
                {member.role}
              </Badge>
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
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
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
