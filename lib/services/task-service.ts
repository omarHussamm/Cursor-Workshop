import { prisma } from "@/lib/db/prisma";
import type { Task } from "@prisma/client";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task-schema";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

/**
 * Task Service
 * Handles all business logic related to tasks
 */
export const taskService = {
  /**
   * Get all tasks with pagination
   */
  async getTasks(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * pageSize;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: pageSize,
        orderBy: [
          { priority: "asc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.task.count(),
    ]);

    return {
      tasks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<Task | null> {
    return await prisma.task.findUnique({
      where: { id },
    });
  },

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskInput): Promise<Task> {
    // Convert empty string to null for optional email field
    const taskData = {
      ...data,
      assigneeEmail: data.assigneeEmail || null,
      assigneeName: data.assigneeName || null,
    };

    return await prisma.task.create({
      data: taskData,
    });
  },

  /**
   * Update an existing task
   */
  async updateTask({ id, ...data }: UpdateTaskInput): Promise<Task> {
    // Convert empty string to null for optional email field
    const updateData = {
      ...data,
      assigneeEmail: data.assigneeEmail === "" ? null : data.assigneeEmail,
      assigneeName: data.assigneeName === "" ? null : data.assigneeName,
    };

    return await prisma.task.update({
      where: { id },
      data: updateData,
    });
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<Task> {
    return await prisma.task.delete({
      where: { id },
    });
  },

  /**
   * Get tasks by status
   */
  async getTasksByStatus(status: "TODO" | "IN_PROGRESS" | "DONE"): Promise<Task[]> {
    return await prisma.task.findMany({
      where: { status },
      orderBy: [
        { priority: "asc" },
        { createdAt: "desc" },
      ],
    });
  },
};
