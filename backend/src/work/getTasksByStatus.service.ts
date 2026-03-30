export function transformTasksByStatusData(data: {
  open: number;
  inProgress: number;
  blocked: number;
  done: number;
  cancelled: number;
}) {
  return {
    open: data.open,
    inProgress: data.inProgress,
    blocked: data.blocked,
    done: data.done,
    cancelled: data.cancelled,
  };
}
