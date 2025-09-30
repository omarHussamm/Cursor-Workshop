import { notFound } from "next/navigation";
import { taskService } from "@/lib/services/task-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import { CommentsList } from "@/components/features/comments-list";
import { CommentForm } from "@/components/features/comment-form";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Task Detail Page - Server Component
 * Displays task details and comments
 */
export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = await taskService.getTaskWithComments(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Task Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-3xl">{task.title}</CardTitle>
              {task.description && (
                <CardDescription className="text-base">{task.description}</CardDescription>
              )}
            </div>
            <Badge variant={task.status === "DONE" ? "default" : "secondary"}>
              {TASK_STATUS_LABELS[task.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Priority</p>
              <p className="font-medium">{task.priority}</p>
            </div>
            {task.assigneeName && (
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p className="font-medium">{task.assigneeName}</p>
                {task.assigneeEmail && (
                  <p className="text-xs text-muted-foreground">{task.assigneeEmail}</p>
                )}
              </div>
            )}
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {new Date(task.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Comments</h2>
        
        {/* Comment Form */}
        <CommentForm taskId={task.id} />
        
        {/* Comments List */}
        <CommentsList comments={task.comments} />
      </div>
    </div>
  );
}
