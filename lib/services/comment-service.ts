import { prisma } from "@/lib/db/prisma";
import type { Comment } from "@prisma/client";
import type { CreateCommentInput, UpdateCommentInput } from "@/lib/validations/comment-schema";

/**
 * Comment Service
 * Handles all business logic related to comments
 */
export const commentService = {
  /**
   * Get all comments for a specific task
   * Ordered by creation date (oldest first)
   */
  async getComments(taskId: string): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
    });
  },

  /**
   * Get a single comment by ID
   */
  async getCommentById(id: string): Promise<Comment | null> {
    return await prisma.comment.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentInput): Promise<Comment> {
    return await prisma.comment.create({
      data: {
        taskId: data.taskId,
        authorName: data.authorName,
        authorEmail: data.authorEmail,
        content: data.content,
      },
    });
  },

  /**
   * Update an existing comment
   * Caller must verify authorization before calling this method
   */
  async updateComment(id: string, content: string): Promise<Comment> {
    return await prisma.comment.update({
      where: { id },
      data: { content },
    });
  },

  /**
   * Delete a comment
   * Caller must verify authorization before calling this method
   */
  async deleteComment(id: string): Promise<Comment> {
    return await prisma.comment.delete({
      where: { id },
    });
  },

  /**
   * Check if a user is authorized to modify a comment
   * Returns true if the comment belongs to the user
   */
  async checkAuthorization(commentId: string, userEmail: string): Promise<boolean> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorEmail: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    return comment.authorEmail === userEmail;
  },
};
