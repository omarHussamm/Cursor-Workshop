"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteTask } from "@/lib/actions/task-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { TaskForm } from "./task-form";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import type { Task } from "@prisma/client";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteTask(task.id);
      
      if (result.success) {
        toast.success("Task deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "TODO":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "DONE":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "text-green-600";
    if (priority === 3) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/tasks/${task.id}`} className="hover:underline">
              <CardTitle className="text-lg">{task.title}</CardTitle>
            </Link>
            <CardDescription className="mt-1">
              {task.description || "No description"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href={`/tasks/${task.id}`}>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </Button>
            </Link>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm task={task} onSuccess={() => setIsEditOpen(false)} />
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusVariant(task.status)}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            Priority: {task.priority}
          </Badge>
          {task.assigneeName && (
            <Badge variant="outline">
              Assigned to: {task.assigneeName}
            </Badge>
          )}
        </div>
        {task.assigneeEmail && (
          <p className="text-sm text-muted-foreground mt-2">{task.assigneeEmail}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
