import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";

/**
 * Not found page for task detail
 */
export default function TaskNotFound() {
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Task Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The task you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/tasks">
            <Button>Back to Tasks</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
