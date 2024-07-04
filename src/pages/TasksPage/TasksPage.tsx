import { ClaimReward } from "@/pages/TasksPage/components/ClaimReward";
import { TasksList } from "@/pages/TasksPage/components/TaskList";
import { useState } from "react";

export default function TasksPage() {
  const [hasShared, setHasShared] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {hasShared ? (
        <ClaimReward />
      ) : (
        <TasksList onShare={(hasShared: boolean) => setHasShared(hasShared)} />
      )}
    </main>
  );
}
