interface ActionButtonProps {
  children: string;
  onShare: () => void;
  bgColor?: string;
}

export const ActionButton = ({
  children,
  onShare,
  bgColor,
}: ActionButtonProps) => {
  const styles = `${
    bgColor || "bg-blue"
  } rounded h-10 w-20 text-center flex items-center justify-center border border-black`;

  return (
    <a onClick={onShare} className={styles}>
      <div>{children}</div>
    </a>
  );
};
