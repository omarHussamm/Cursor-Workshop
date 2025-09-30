"use server";

import { revalidatePath } from "next/cache";
import { taskService } from "@/lib/services/task-service";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task-schema";
import type { ActionResponse } from "@/lib/types";
import type { Task } from "@prisma/client";

/**
 * Server Action: Get all tasks with pagination
 */
export async function getTasks(page: number = 1, pageSize: number = 10) {
  try {
    const result = await taskService.getTasks(page, pageSize);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch tasks",
    };
  }
}

/**
 * Server Action: Create a new task
 */
export async function createTask(formData: FormData): Promise<ActionResponse<Task>> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string | undefined,
      status: (formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE") || "TODO",
      priority: parseInt(formData.get("priority") as string) || 3,
      assigneeName: formData.get("assigneeName") as string | undefined,
      assigneeEmail: formData.get("assigneeEmail") as string | undefined,
    };

    const validatedData = createTaskSchema.parse(rawData);
    const task = await taskService.createTask(validatedData);

    revalidatePath("/tasks");

    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

/**
 * Server Action: Update an existing task
 */
export async function updateTask(id: string, formData: FormData): Promise<ActionResponse<Task>> {
  try {
    const rawData = {
      id,
      title: formData.get("title") as string | undefined,
      description: formData.get("description") as string | undefined,
      status: formData.get("status") as "TODO" | "IN_PROGRESS" | "DONE" | undefined,
      priority: formData.get("priority") ? parseInt(formData.get("priority") as string) : undefined,
      assigneeName: formData.get("assigneeName") as string | undefined,
      assigneeEmail: formData.get("assigneeEmail") as string | undefined,
    };

    const validatedData = updateTaskSchema.parse(rawData);
    const task = await taskService.updateTask(validatedData);

    revalidatePath("/tasks");

    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

/**
 * Server Action: Delete a task
 */
export async function deleteTask(id: string): Promise<ActionResponse<Task>> {
  try {
    const task = await taskService.deleteTask(id);

    revalidatePath("/tasks");

    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
