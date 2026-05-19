import closeCircleIcon from "../../assets/icons/close_circle.svg";

type DeleteButtonProps = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

export default function DeleteButton({
  onClick,
  className = "",
  ariaLabel = "삭제",
}: DeleteButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`
        cursor-pointer
        ${className}
      `}
    >
      <img src={closeCircleIcon} alt="" width={30} height={30} />
    </button>
  );
}
