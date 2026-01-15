import z from "zod";

const stringPortSchema = z.string().min(1).max(65535);
const numberPortSchema = z.number().min(1).max(65535);

const configSchema = z.object({
  PORT: z.union([stringPortSchema, numberPortSchema]),
  ENV: z.enum(["production", "testing", "development"]),
  POSTGRESQL_URI: z.string().min(1, "POSTGRESQL_URI is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
  BULL_REDIS_URL: z.string().optional(),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY"),
});

export default configSchema;
