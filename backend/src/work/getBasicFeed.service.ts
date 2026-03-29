export function transformBasicFeedData(data: {
  totalMembers: number;
  memberLimit: number | null;
  incidents: {
    total: number;
    critical: number;
  };
  tasks: {
    total: number;
    urgent: number;
  };
  improvements: {
    total: number;
  };
}) {
  return {
    totalMembers: data.totalMembers,
    memberLimit: data.memberLimit,
    incidents: {
      total: data.incidents.total,
      critical: data.incidents.critical,
    },
    tasks: {
      total: data.tasks.total,
      urgent: data.tasks.urgent,
    },
    improvements: {
      total: data.improvements.total,
    },
  };
}
