type MenuItemProps = {
  label: string;
  onClick?: () => void;
};

export function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full text-left
        text-body-r-16
        cursor-pointer
      "
    >
      {label}
    </button>
  );
}
