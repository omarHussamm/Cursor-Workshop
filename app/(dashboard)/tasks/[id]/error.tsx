"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface TaskDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for task detail page
 */
export default function TaskDetailError({ error, reset }: TaskDetailErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error("Task detail error:", error);
  }, [error]);

  return (
    <div>
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Error Loading Task</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Something went wrong while loading the task details. Please try again.
          </p>
          {error.message && (
            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
              {error.message}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
