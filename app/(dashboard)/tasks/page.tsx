import { Suspense } from "react";
import { getTasks } from "@/lib/actions/task-actions";
import { TaskList } from "@/components/features/task-list";
import { TaskFormDialog } from "@/components/features/task-form-dialog";

interface TasksPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const result = await getTasks(page);

  if (!result.success || !result.data) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Tasks</h1>
        <p className="text-destructive">Failed to load tasks. Please try again.</p>
      </div>
    );
  }

  const { tasks, total, totalPages } = result.data;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tasks efficiently
          </p>
        </div>
        <TaskFormDialog />
      </div>

      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskList
          tasks={tasks}
          currentPage={page}
          totalPages={totalPages}
          total={total}
        />
      </Suspense>
    </div>
  );
}
