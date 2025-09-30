import { z } from "zod";
import { MAX_COMMENT_LENGTH, MIN_COMMENT_LENGTH } from "@/lib/constants";
import { sanitizeContent } from "@/lib/utils/sanitize";

/**
 * Validation schema for creating a new comment
 */
export const createCommentSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
  authorName: z
    .string()
    .min(MIN_COMMENT_LENGTH, "Author name is required")
    .max(100, "Author name must be less than 100 characters"),
  authorEmail: z
    .string()
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters"),
  content: z
    .string()
    .min(MIN_COMMENT_LENGTH, "Comment content is required")
    .max(MAX_COMMENT_LENGTH, `Comment must be less than ${MAX_COMMENT_LENGTH} characters`)
    .transform((val) => sanitizeContent(val)), // Sanitize to prevent XSS
});

/**
 * Validation schema for updating an existing comment
 */
export const updateCommentSchema = z.object({
  id: z.string().uuid("Invalid comment ID"),
  content: z
    .string()
    .min(MIN_COMMENT_LENGTH, "Comment content is required")
    .max(MAX_COMMENT_LENGTH, `Comment must be less than ${MAX_COMMENT_LENGTH} characters`)
    .transform((val) => sanitizeContent(val)), // Sanitize to prevent XSS
  authorEmail: z.string().email("Invalid email format"), // For authorization check
});

/**
 * Type inference for create comment input
 */
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * Type inference for update comment input
 */
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
