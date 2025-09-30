"use client";

import { useState } from "react";
import type { Comment } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { updateComment, deleteComment } from "@/lib/actions/comment-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
}

/**
 * Get initials from author name
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Comment Item Component
 * Displays a single comment with edit/delete functionality
 */
export function CommentItem({ comment }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setUserEmail(comment.authorEmail); // In a real app, get from session
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append("content", editContent);
      formData.append("authorEmail", userEmail);

      const result = await updateComment(comment.id, formData);

      if (result.success) {
        toast.success("Comment updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update comment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteComment(comment.id, comment.authorEmail);

      if (result.success) {
        toast.success("Comment deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const relativeTime = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar>
            <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            {/* Author Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{comment.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {comment.authorEmail} · {relativeTime}
                </p>
              </div>

              {/* Action Buttons - Only show for comment author */}
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEdit}
                      disabled={isDeleting}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>

            {/* Comment Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isUpdating}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
