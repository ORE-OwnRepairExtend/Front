type NavButtonProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "logout";
};

export default function NavButton({
  icon,
  label,
  active = false,
  onClick,
  variant = "default",
}: NavButtonProps) {
  const bgStyle =
    variant === "logout"
      ? "bg-neutral-03"
      : active
        ? "bg-primary-01"
        : "bg-white";

  const textStyle =
    variant === "logout"
      ? "text-gray-01"
      : active
        ? "text-white"
        : "text-gray-01";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-[45px] w-full items-center gap-[10px] rounded-[10px] px-[15px]
        transition-colors duration-200
        cursor-pointer
        ${bgStyle}
      `}
    >
      {/* 아이콘 */}
      <span className={textStyle}>{icon}</span>

      {/* 타이틀명 */}
      <span className={`text-button-main  ${textStyle}`}>{label}</span>
    </button>
  );
}
