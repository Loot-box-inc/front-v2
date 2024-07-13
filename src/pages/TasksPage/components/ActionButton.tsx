import { classNames } from "@telegram-apps/sdk";

interface ActionButtonProps {
  disabled?: boolean;
  children: string;
  onShare: () => void;
}

export const ActionButton = ({
  children,
  onShare,
  disabled = false,
}: ActionButtonProps) => {
  return (
    <a
      onClick={onShare}
      className={classNames(
        "rounded h-10 w-20 text-center  flex items-center justify-center",
        disabled ? "bg-gray-300" : "bg-blue"
      )}
    >
      <div>{children}</div>
    </a>
  );
};
