"use client";

import type { Comment } from "@prisma/client";
import { CommentItem } from "./comment-item";

interface CommentsListProps {
  comments: Comment[];
}

/**
 * Comments List Component
 * Client component for displaying a list of comments
 */
export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
