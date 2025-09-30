"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addComment } from "@/lib/actions/comment-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";

const commentFormSchema = z.object({
  authorName: z.string().min(1, "Name is required").max(100, "Name too long"),
  authorEmail: z.string().email("Invalid email format"),
  content: z
    .string()
    .min(1, "Comment is required")
    .max(MAX_COMMENT_LENGTH, `Comment must be less than ${MAX_COMMENT_LENGTH} characters`),
});

type CommentFormData = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  taskId: string;
}

/**
 * Comment Form Component
 * Client component for adding new comments
 */
export function CommentForm({ taskId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("authorName", data.authorName);
      formData.append("authorEmail", data.authorEmail);
      formData.append("content", data.content);

      const result = await addComment(taskId, formData);

      if (result.success) {
        toast.success("Comment added successfully");
        reset();
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Your Name</Label>
              <Input
                id="authorName"
                placeholder="John Doe"
                {...register("authorName")}
                disabled={isSubmitting}
              />
              {errors.authorName && (
                <p className="text-sm text-destructive">{errors.authorName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorEmail">Your Email</Label>
              <Input
                id="authorEmail"
                type="email"
                placeholder="john@example.com"
                {...register("authorEmail")}
                disabled={isSubmitting}
              />
              {errors.authorEmail && (
                <p className="text-sm text-destructive">{errors.authorEmail.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Comment</Label>
            <Textarea
              id="content"
              placeholder="Write your comment here..."
              rows={4}
              {...register("content")}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
