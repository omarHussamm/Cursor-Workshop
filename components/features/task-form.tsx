"use client";

import { useState, useTransition } from "react";
import { createTask, updateTask } from "@/lib/actions/task-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, TASK_STATUS_LABELS, DEFAULT_PRIORITY } from "@/lib/constants";
import type { Task, TaskStatus } from "@prisma/client";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: (task?.status || "TODO") as TaskStatus,
    priority: task?.priority?.toString() || DEFAULT_PRIORITY.toString(),
    assigneeName: task?.assigneeName || "",
    assigneeEmail: task?.assigneeEmail || "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formDataObj = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = task
        ? await updateTask(task.id, formDataObj)
        : await createTask(formDataObj);

      if (result.success) {
        if (!task) {
          // Reset form only for new tasks
          setFormData({
            title: "",
            description: "",
            status: "TODO" as TaskStatus,
            priority: DEFAULT_PRIORITY.toString(),
            assigneeName: "",
            assigneeEmail: "",
          });
        }
        onSuccess?.();
      } else {
        setError(result.error || "An error occurred");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
          maxLength={200}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description (optional)"
          rows={4}
          disabled={isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value: string) => setFormData({ ...formData, status: value as TaskStatus })}
            disabled={isPending}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority (1-5)</Label>
          <Select
            name="priority"
            value={formData.priority}
            onValueChange={(value: string) => setFormData({ ...formData, priority: value })}
            disabled={isPending}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigneeName">Assignee Name</Label>
        <Input
          id="assigneeName"
          name="assigneeName"
          value={formData.assigneeName}
          onChange={(e) => setFormData({ ...formData, assigneeName: e.target.value })}
          placeholder="Enter assignee name (optional)"
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigneeEmail">Assignee Email</Label>
        <Input
          id="assigneeEmail"
          name="assigneeEmail"
          type="email"
          value={formData.assigneeEmail}
          onChange={(e) => setFormData({ ...formData, assigneeEmail: e.target.value })}
          placeholder="Enter assignee email (optional)"
          disabled={isPending}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
