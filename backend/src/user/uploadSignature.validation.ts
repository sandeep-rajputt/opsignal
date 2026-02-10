import z from "zod";

const uploadSignatureSchema = z.object({
  folder: z.string().optional(),
});

export default uploadSignatureSchema;
