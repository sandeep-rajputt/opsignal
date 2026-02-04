import z from "zod";

const roleSchema = z.enum(["owner", "admin", "manager", "member"]);

export type UserRole = z.infer<typeof roleSchema>;
export default roleSchema;
