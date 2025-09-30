/**
 * Application Constants
 * Use these instead of hardcoded values throughout the application
 */

// Task validation constants
export const MAX_TITLE_LENGTH = 200;
export const MIN_PRIORITY = 1;
export const MAX_PRIORITY = 5;
export const DEFAULT_PRIORITY = 3;

// Comment validation constants
export const MAX_COMMENT_LENGTH = 2000;
export const MIN_COMMENT_LENGTH = 1;

// Database constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Task status options
export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

// Task status labels
export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};
