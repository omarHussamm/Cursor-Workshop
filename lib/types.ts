/**
 * Standard response type for Server Actions
 */
export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
