import { ReactNode } from "react";

interface ActionItemProps {
  text: string;
  actionButton: ReactNode;
}

export const ActionItem = ({ text, actionButton }: ActionItemProps) => {
  return (
    <div className="flex flex-row justify-between items-center mb-5">
      <span className="w-2/3 text-white">{text}</span>
      {actionButton}
    </div>
  );
};
