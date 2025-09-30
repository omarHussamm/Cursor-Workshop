import { TaskListSkeleton } from "@/components/features/task-skeleton";

export default function TasksLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <TaskListSkeleton />
    </div>
  );
}
