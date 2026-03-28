import z from "zod";

// 'status_change'
const statusChangeSchema = z.object({
  name: z.literal("status_change"),
  data: z.object({
    from: z.string(),
    to: z.string(),
    by: z.object({
      id: z.string(),
      name: z.string(),
    }),
    at: z.string(),
  }),
});

// severity_change
const severityChangeSchema = z.object({
  name: z.literal("severity_change"),
  data: z.object({
    from: z.string(),
    to: z.string(),
    by: z.object({
      id: z.string(),
      name: z.string(),
    }),
    at: z.string(),
  }),
});

// priority_change
const priorityChangeSchema = z.object({
  name: z.literal("priority_change"),
  data: z.object({
    from: z.string(),
    to: z.string(),
    by: z.object({
      id: z.string(),
      name: z.string(),
    }),
    at: z.string(),
  }),
});

// category_change
const categoryChangeSchema = z.object({
  name: z.literal("category_change"),
  data: z.object({
    from: z.string(),
    to: z.string(),
    by: z.object({
      id: z.string(),
      name: z.string(),
    }),
    at: z.string(),
  }),
});

// content_update
const contentUpdateSchema = z.object({
  name: z.literal("content_update"),
  data: z.object({
    by: z.object({
      id: z.string(),
      name: z.string(),
    }),
    at: z.string(),
  }),
});

const workLogsSchema = z.array(
  z.union([
    statusChangeSchema,
    severityChangeSchema,
    priorityChangeSchema,
    categoryChangeSchema,
    contentUpdateSchema,
  ]),
);

export type WorkLog = z.infer<typeof workLogsSchema>[number];

export default workLogsSchema;
