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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hideAddWorkspaceMember } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addWorkspaceMemberSchema, {
  type AddWorkspaceMemberData,
} from "@/schemas/addWorkspaceMemberSchema";
import { Spinner } from "@/components/ui/spinner";
import { useGetWorkspaceTeamsQuery } from "@/Store/api";
import { Skeleton } from "@/components/ui/skeleton";

function AddWorkspaceMember() {
  const isOpen = useAppSelector((state) => state.dialogs.addWorkspaceMember);
  const workspaceId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.id,
  );
  const dispatch = useAppDispatch();

  // Fetch teams from API
  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useGetWorkspaceTeamsQuery(workspaceId || "", {
    skip: !workspaceId || !isOpen,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddWorkspaceMemberData>({
    resolver: zodResolver(addWorkspaceMemberSchema),
    defaultValues: {
      email: "",
      role: undefined,
      teamId: "",
    },
  });

  const handleClose = () => {
    dispatch(hideAddWorkspaceMember());
    reset();
  };

  const onSubmit = async (data: AddWorkspaceMemberData) => {
    // Demo: Show success message
    toast.success(`Member invitation sent to ${data.email}`);
    handleClose();
  };

  const teams = teamsData?.data || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Workspace Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join your workspace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="member-email">Email Address</FieldLabel>
              <Input
                id="member-email"
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

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="member-role">Role</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="member-role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <FieldDescription className="text-destructive">
                      {errors.role.message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            />

            <Controller
              name="teamId"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="member-team">Team</FieldLabel>
                  {teamsLoading ? (
                    <Skeleton className="h-9 w-full" />
                  ) : teamsError ? (
                    <div className="text-sm text-destructive">
                      Failed to load teams
                    </div>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || teams.length === 0}
                    >
                      <SelectTrigger id="member-team" className="w-full">
                        <SelectValue
                          placeholder={
                            teams.length === 0
                              ? "No teams available"
                              : "Select a team"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.teamId && (
                    <FieldDescription className="text-destructive">
                      {errors.teamId.message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            />
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
            <Button type="submit" disabled={isSubmitting}>
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

export default AddWorkspaceMember;
