import z from "zod";

const taskPrioritySchema = z.enum(["urgent", "high", "medium", "low"]);

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export default taskPrioritySchema;
