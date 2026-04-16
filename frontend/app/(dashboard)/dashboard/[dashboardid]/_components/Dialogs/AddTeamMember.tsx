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
import { useGetUserTeamQuery, useAddTeamMemberMutation } from "@/Store/api";
import { Skeleton } from "@/components/ui/skeleton";
import isApiError from "@/utils/isApiError";

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

  // Add team member mutation
  const [addTeamMember, { isLoading: isAdding }] = useAddTeamMemberMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
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

    if (!currentWorkspace?.id) {
      toast.error("Workspace not found");
      return;
    }

    try {
      await addTeamMember({
        workspaceId: currentWorkspace.id,
        email: data.email,
        teamId: userTeamData.data.id,
      }).unwrap();

      toast.success(`Team member added successfully`);
      handleClose();
    } catch (err) {
      const apiError = isApiError(err);
      if (apiError) {
        toast.error(apiError.message || "Failed to add team member");
      } else {
        toast.error("Failed to add team member");
      }
    }
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
                disabled={isAdding}
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
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding || isLoadingTeam || !userTeam}
            >
              {isAdding ? (
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
