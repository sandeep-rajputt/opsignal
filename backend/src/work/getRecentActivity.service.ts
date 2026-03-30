export function transformRecentActivityData(
  activities: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    severityOrPriority: string | null;
    category: string | null;
    createdBy: string;
    createdById: string;
    createdAt: string;
    teamName: string | null;
  }>,
) {
  return activities.map((activity) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    status: activity.status,
    severityOrPriority: activity.severityOrPriority,
    category: activity.category,
    createdBy: activity.createdBy,
    createdById: activity.createdById,
    createdAt: activity.createdAt,
    teamName: activity.teamName,
  }));
}
