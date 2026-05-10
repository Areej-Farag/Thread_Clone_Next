import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3)
    .max(5000, "Thread content must be between 3 and 5000 characters"),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3)
    .max(5000, "Thread content must be between 3 and 5000 characters"),
  accountId: z.string(),
});
