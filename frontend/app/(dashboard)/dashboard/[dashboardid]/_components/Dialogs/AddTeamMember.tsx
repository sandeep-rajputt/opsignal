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
import { hideAddTeamMember } from "@/Store/slice/dialogsSlice";
import { useAppDispatch, useAppSelector } from "@/Store/hooks";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import addTeamMemberSchema, {
  type AddTeamMemberData,
} from "@/schemas/addTeamMemberSchema";
import { Spinner } from "@/components/ui/spinner";
import { useGetWorkspaceTeamsQuery } from "@/Store/api";
import { Skeleton } from "@/components/ui/skeleton";

function AddTeamMember() {
  const isOpen = useAppSelector((state) => state.dialogs.addTeamMember);
  const currentWorkspace = useAppSelector(
    (state) => state.currentWorkspace.workspace,
  );
  const dispatch = useAppDispatch();

  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useGetWorkspaceTeamsQuery(currentWorkspace?.id || "", {
    skip: !currentWorkspace?.id || !isOpen,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTeamMemberData>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: {
      email: "",
      teamId: "",
    },
  });

  const handleClose = () => {
    dispatch(hideAddTeamMember());
    reset();
  };

  const onSubmit = async (data: AddTeamMemberData) => {
    // Demo: Show success message
    const selectedTeam = teamsData?.data.find((t) => t.id === data.teamId);
    toast.success(
      `Team member invitation sent to ${data.email} for ${selectedTeam?.name || "team"}`,
    );
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Invite a new member to join a team
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

            <Controller
              name="teamId"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="team-member-team">Team</FieldLabel>
                  {isLoadingTeams ? (
                    <Skeleton className="h-9 w-full" />
                  ) : teamsError ? (
                    <FieldDescription className="text-destructive">
                      Failed to load teams
                    </FieldDescription>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || !teamsData?.data.length}
                    >
                      <SelectTrigger id="team-member-team" className="w-full">
                        <SelectValue
                          placeholder={
                            teamsData?.data.length
                              ? "Select a team"
                              : "No teams available"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {teamsData?.data.map((team) => (
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
            <Button type="submit" disabled={isSubmitting || isLoadingTeams}>
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
