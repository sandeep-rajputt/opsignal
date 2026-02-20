"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { hideAddTeamMember } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailSchema from "@/schemas/common/emailSchema";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserTeamQuery } from "@/Store/api";
import { Skeleton } from "@/components/ui/skeleton";

const addTeamMemberFormSchema = z.object({
  email: emailSchema,
});

type AddTeamMemberFormData = z.infer<typeof addTeamMemberFormSchema>;

function AddTeamMember() {
  const isOpen = useAppSelector((state) => state.dialogs.addTeamMember);
  const currentWorkspace = useAppSelector(
    (state) => state.currentWorkspace.workspace,
  );
  const dispatch = useAppDispatch();

  const {
    data: userTeamData,
    isLoading: isLoadingTeam,
    error: teamError,
  } = useGetUserTeamQuery(currentWorkspace?.id || "", {
    skip: !currentWorkspace?.id || !isOpen,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddTeamMemberFormData>({
    resolver: zodResolver(addTeamMemberFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleClose = () => {
    dispatch(hideAddTeamMember());
    reset();
  };

  const onSubmit = async (data: AddTeamMemberFormData) => {
    if (!userTeamData?.data?.id) {
      toast.error("Team information not available");
      return;
    }

    // Demo: Show success message with team ID
    const teamName = userTeamData.data.name;
    const teamId = userTeamData.data.id;

    console.log("Adding member:", {
      email: data.email,
      teamId: teamId,
    });

    toast.success(
      `Team member invitation sent to ${data.email} for ${teamName}`,
    );
    handleClose();
  };

  const userTeam = userTeamData?.data;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="team-member-email">Email Address</FieldLabel>
              <Input
                id="team-member-email"
                type="email"
                placeholder="member@example.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <FieldDescription className="text-destructive">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="team-member-team">Team</FieldLabel>
              {isLoadingTeam ? (
                <Skeleton className="h-9 w-full" />
              ) : teamError ? (
                <FieldDescription className="text-destructive">
                  Failed to load your team
                </FieldDescription>
              ) : userTeam ? (
                <div className="flex items-center h-9 px-3 py-2 border border-input rounded-md bg-muted text-sm">
                  {userTeam.name}
                </div>
              ) : (
                <FieldDescription className="text-destructive">
                  You are not assigned to any team
                </FieldDescription>
              )}
            </Field>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingTeam || !userTeam}
            >
              {isSubmitting ? (
                <>
                  Adding <Spinner />
                </>
              ) : (
                "Add Member"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTeamMember;
