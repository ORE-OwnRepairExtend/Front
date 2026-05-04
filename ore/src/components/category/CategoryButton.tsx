type CategoryButtonProps = {
  label: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function CategoryButton({
  label,
  icon,
  isSelected = false,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-center gap-[10px]
        rounded-[25px]
        transition-all duration-200
        px-[20px] py-[5px]
        w-max h-[50px]
        cursor-pointer
        
        ${
          isSelected
            ? "text-title-b-16 text-primary-01 bg-secondary-01 border-[3px] border-primary-01"
            : "text-title-m-16 text-gray-01 bg-white"
        }
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
