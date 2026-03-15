"use client";

import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  SelectContent,
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/Store/hooks";
import { useGetWorkspaceTeamsQuery } from "@/Store/api/getWorkspaceTeamsApi/getWorkspaceTeamsApi";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/rbac/permissions";

interface TeamFieldProps {
  onChange: (val: string) => void;
  value?: string;
  error?: string;
}

export function AllTeamWorkField({ onChange, value, error }: TeamFieldProps) {
  const workspaceId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.id,
  );

  const { data } = useGetWorkspaceTeamsQuery(workspaceId ?? "", {
    skip: !workspaceId,
  });

  const teams = data?.data ?? [];

  return (
    <Field className="mt-4">
      <FieldLabel htmlFor="teamId">
        Team <span className="text-destructive">*</span>
      </FieldLabel>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger id="teamId">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">Global</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </Field>
  );
}

export function MyTeamWorkField({ onChange, value, error }: TeamFieldProps) {
  const userTeamId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.team,
  );
  const workspaceId = useAppSelector(
    (state) => state.currentWorkspace.workspace?.id,
  );

  const { data } = useGetWorkspaceTeamsQuery(workspaceId ?? "", {
    skip: !workspaceId,
  });

  const myTeam = data?.data.find((t) => t.id === userTeamId);

  return (
    <Field className="mt-4">
      <FieldLabel htmlFor="teamId">
        Team <span className="text-destructive">*</span>
      </FieldLabel>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger id="teamId">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          {myTeam && <SelectItem value={myTeam.id}>{myTeam.name}</SelectItem>}
        </SelectContent>
      </Select>
      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </Field>
  );
}

export function TeamFieldByPermission(props: TeamFieldProps) {
  const { allowed: canCreateWorkspaceWork } = usePermission(
    Permission.CREATE_WORKSPACE_WORK,
  );

  if (canCreateWorkspaceWork) {
    return <AllTeamWorkField {...props} />;
  }

  return <MyTeamWorkField {...props} />;
}
