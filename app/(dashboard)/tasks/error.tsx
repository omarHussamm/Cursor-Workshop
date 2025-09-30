"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TasksError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Tasks page error:", error);
  }, [error]);

  return (
    <div>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Something went wrong!</CardTitle>
            </div>
            <CardDescription>
              An error occurred while loading your tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Go home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
