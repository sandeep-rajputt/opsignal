import z from "zod";

const taskStatusSchema = z.enum([
  "open",
  "in_progress",
  "blocked",
  "done",
  "cancelled",
]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export default taskStatusSchema;
