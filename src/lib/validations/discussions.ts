import { z } from "zod/v4";

export const createThreadSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be under 200 characters"),
  body: z.string().min(10, "Body must be at least 10 characters").max(5000, "Body must be under 5000 characters"),
  listingId: z.string().uuid().optional(),
});

export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(2000, "Comment must be under 2000 characters"),
  threadId: z.string().uuid(),
  parentCommentId: z.string().uuid().optional(),
});

export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
