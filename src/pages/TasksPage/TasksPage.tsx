// import { ClaimReward } from "@/pages/TasksPage/components/ClaimReward";
import { TasksList } from "@/pages/TasksPage/components/TaskList";
import { initBackButton } from "@telegram-apps/sdk";

export const TasksPage = () => {
  const [backButton] = initBackButton();
  backButton.hide();

  // const [hasShared, setHasShared] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <TasksList />
    </main>
  );
};
