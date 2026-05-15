type ProductCreateCategoryProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function ProductCreateCategory({
  label,
  selected = false,
  onClick,
}: ProductCreateCategoryProps) {
  const baseStyle =
    "flex items-center gap-[5px] rounded-[20px] border px-[10px] py-[5px] text-body-m-10";

  const activeStyle = "border-primary-01 bg-secondary-01 text-primary-01";

  const defaultStyle = "border-neutral-01 bg-white text-primary-01";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyle} ${selected ? activeStyle : defaultStyle}`}
    >
      <span>{label}</span>
    </button>
  );
}
