export function transformIncidentsBySeverityData(data: {
  critical: number;
  high: number;
  medium: number;
  low: number;
}) {
  return {
    critical: data.critical,
    high: data.high,
    medium: data.medium,
    low: data.low,
  };
}
