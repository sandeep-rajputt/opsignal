import z from "zod";

const nameSchema = z
  .string()
  .min(2, { message: "Name must contain at least 2 characters." })
  .max(20, { message: "Name cannot exceed 20 characters." });

export default nameSchema;
