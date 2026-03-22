type ButtonVariant = "primary" | "secondary";

type CommonButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string; // 확장용
};

export default function CommonButton({
  children,
  variant = "primary",
  onClick,
  className = "",
}: CommonButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex h-[30px] px-[20px] py-[5px]
        items-center justify-center gap-[10px]
        rounded-[10px]
        text-button-main
        cursor-pointer
        ${
          variant === "primary"
            ? "bg-primary-01 text-white"
            : "bg-secondary-01 text-primary-01"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
