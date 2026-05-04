type ProductCreateHeaderProps = {
  title?: string;
  onClose?: () => void;
};

export default function ProductCreateHeader({
  title = "제품 등록",
  onClose,
}: ProductCreateHeaderProps) {
  return (
    <header
      className="
        flex w-full flex-col items-start gap-[10px]
        rounded-t-[50px] bg-primary-01
        px-[30px] pb-[10px] pt-[30px]
      "
    >
      <div className="flex w-full items-end justify-between">
        <h1 className="text-title-main text-white">{title}</h1>

        <button type="button" onClick={onClose} className="cursor-pointer">
          <img
            src="/icons/close_white.svg"
            alt="닫기"
            className="h-[30px] w-[30px]"
          />
        </button>
      </div>

      <div className="h-[2px] w-full bg-white" />
    </header>
  );
}
