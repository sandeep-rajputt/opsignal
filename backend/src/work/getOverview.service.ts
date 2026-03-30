export function transformOverviewData(data: {
  name: string;
  plan: string;
  memberLimit: number | null;
  totalTeams: number | null;
  totalMembers: number;
  totalIncidents: number;
  totalTasks: number;
  totalImprovements: number;
}) {
  return {
    name: data.name,
    plan: data.plan,
    memberLimit: data.memberLimit,
    totalTeams: data.totalTeams,
    totalMembers: data.totalMembers,
    totalIncidents: data.totalIncidents,
    totalTasks: data.totalTasks,
    totalImprovements: data.totalImprovements,
  };
}
