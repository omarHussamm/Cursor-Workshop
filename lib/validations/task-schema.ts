import { z } from "zod";
import { MAX_TITLE_LENGTH, MIN_PRIORITY, MAX_PRIORITY } from "@/lib/constants";

/**
 * Validation schema for creating a new task
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH, `Title must be less than ${MAX_TITLE_LENGTH} characters`),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z
    .number()
    .int()
    .min(MIN_PRIORITY, `Priority must be at least ${MIN_PRIORITY}`)
    .max(MAX_PRIORITY, `Priority must be at most ${MAX_PRIORITY}`)
    .default(3),
  assigneeName: z.string().optional(),
  assigneeEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
});

/**
 * Validation schema for updating an existing task
 */
export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid("Invalid task ID"),
});

/**
 * Type inference for create task input
 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Type inference for update task input
 */
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
