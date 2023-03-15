import { z } from "zod";

export const LazyLockSchema = z.record(z.string(), z.object({
  branch: z.string(),
  commit: z.string(),
}))

export type LazyLockSchema = z.infer<typeof LazyLockSchema>;
