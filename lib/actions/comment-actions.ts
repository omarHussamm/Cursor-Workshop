"use server";

import { revalidatePath } from "next/cache";
import { commentService } from "@/lib/services/comment-service";
import { createCommentSchema, updateCommentSchema } from "@/lib/validations/comment-schema";
import type { ActionResponse } from "@/lib/types";
import type { Comment } from "@prisma/client";
import { z } from "zod";

/**
 * Server Action: Get all comments for a task
 */
export async function getComments(taskId: string): Promise<ActionResponse<Comment[]>> {
  try {
    const comments = await commentService.getComments(taskId);
    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error("Error fetching comments:", { taskId, error, timestamp: new Date().toISOString() });
    return {
      success: false,
      error: "Failed to fetch comments",
    };
  }
}

/**
 * Server Action: Add a new comment to a task
 */
export async function addComment(taskId: string, formData: FormData): Promise<ActionResponse<Comment>> {
  try {
    const rawData = {
      taskId,
      authorName: formData.get("authorName") as string,
      authorEmail: formData.get("authorEmail") as string,
      content: formData.get("content") as string,
    };

    const validatedData = createCommentSchema.parse(rawData);
    const comment = await commentService.createComment(validatedData);

    revalidatePath(`/tasks/${taskId}`);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("Error creating comment:", { taskId, error, timestamp: new Date().toISOString() });
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation failed",
      };
    }
    
    return {
      success: false,
      error: "Failed to create comment",
    };
  }
}

/**
 * Server Action: Update an existing comment
 * Only the comment author can update their comment
 */
export async function updateComment(commentId: string, formData: FormData): Promise<ActionResponse<Comment>> {
  try {
    const rawData = {
      id: commentId,
      content: formData.get("content") as string,
      authorEmail: formData.get("authorEmail") as string,
    };

    const validatedData = updateCommentSchema.parse(rawData);

    // Check authorization
    const isAuthorized = await commentService.checkAuthorization(
      validatedData.id,
      validatedData.authorEmail
    );

    if (!isAuthorized) {
      return {
        success: false,
        error: "Unauthorized: You can only edit your own comments",
      };
    }

    const comment = await commentService.updateComment(validatedData.id, validatedData.content);

    // Revalidate the task page
    const taskId = comment.taskId;
    revalidatePath(`/tasks/${taskId}`);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("Error updating comment:", { commentId, error, timestamp: new Date().toISOString() });
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation failed",
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update comment",
    };
  }
}

/**
 * Server Action: Delete a comment
 * Only the comment author can delete their comment
 */
export async function deleteComment(commentId: string, userEmail: string): Promise<ActionResponse<Comment>> {
  try {
    // Check authorization
    const isAuthorized = await commentService.checkAuthorization(commentId, userEmail);

    if (!isAuthorized) {
      return {
        success: false,
        error: "Unauthorized: You can only delete your own comments",
      };
    }

    const comment = await commentService.deleteComment(commentId);

    // Revalidate the task page
    const taskId = comment.taskId;
    revalidatePath(`/tasks/${taskId}`);

    return {
      success: true,
      data: comment,
    };
  } catch (error) {
    console.error("Error deleting comment:", { commentId, error, timestamp: new Date().toISOString() });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}
