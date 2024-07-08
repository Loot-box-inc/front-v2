import type { ComponentType, JSX } from "react";

import { HomePage } from "@/pages/HomePage/HomePage";
import TasksPage from "@/pages/TasksPage/TasksPage";
import ClaimPage from "@/pages/ClaimPage/ClaimPage";

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: "/", Component: HomePage },
  { path: "/tasks", Component: TasksPage },
  { path: "/claim", Component: ClaimPage },
];
