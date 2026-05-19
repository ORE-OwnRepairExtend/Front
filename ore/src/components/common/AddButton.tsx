import plusIcon from "../../assets/icons/plus.svg";

type AddButtonProps = {
  title: string;
  onClick?: () => void;
};

export default function AddButton({ title, onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full inline-flex items-center justify-center gap-[10px]
        px-[30px] py-[10px]
        rounded-[15px]
        bg-primary-01
        text-white
        cursor-pointer
      "
    >
      <span>
        <img src={plusIcon} alt="추가하기" width={24} height={24} />
      </span>
      <span>{title}</span>
    </button>
  );
}
