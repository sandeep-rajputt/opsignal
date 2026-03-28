import type { WorkLog } from "../schemas/work/workLogsSchema.js";

export function transformImprovementLogsToWorkLogs(
  logs: Array<{
    log_id: string;
    log_type: string;
    actor_id: string;
    actor_name: string;
    created_at: string;
    from_value: string | null;
    to_value: string | null;
  }>,
): WorkLog[] {
  return logs.map((log) => {
    const baseData = {
      by: {
        id: log.actor_id,
        name: log.actor_name,
      },
      at: log.created_at,
    };

    if (log.log_type === "status_change") {
      return {
        name: "status_change" as const,
        data: {
          from: log.from_value ?? "",
          to: log.to_value ?? "",
          ...baseData,
        },
      };
    }

    if (log.log_type === "severity_change") {
      return {
        name: "severity_change" as const,
        data: {
          from: log.from_value ?? "",
          to: log.to_value ?? "",
          ...baseData,
        },
      };
    }

    if (log.log_type === "priority_change") {
      return {
        name: "priority_change" as const,
        data: {
          from: log.from_value ?? "",
          to: log.to_value ?? "",
          ...baseData,
        },
      };
    }

    if (log.log_type === "category_change") {
      return {
        name: "category_change" as const,
        data: {
          from: log.from_value ?? "",
          to: log.to_value ?? "",
          ...baseData,
        },
      };
    }

    return {
      name: "content_update" as const,
      data: baseData,
    };
  });
}
