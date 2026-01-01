import { z } from "zod";

const emailSchema = z
  .email({ message: "Please enter a valid email address." })
  .max(50, { message: "Email cannot exceed 50 characters." });

export default emailSchema;
