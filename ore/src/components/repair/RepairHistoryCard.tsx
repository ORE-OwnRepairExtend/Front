type RepairHistoryCardProps = {
  repairName: string;
  repairDate: string;
  price: string;
  onClick?: () => void;
};

export default function RepairHistoryCard({
  repairName,
  repairDate,
  price,
  onClick,
}: RepairHistoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex w-full items-center justify-between self-stretch
        rounded-[10px] bg-white
        px-[20px] py-[10px]
        text-left
        cursor-pointer
      "
    >
      <span className="text-body-sb-12">
        {repairName} - {repairDate}
      </span>

      <div className="flex items-center justify-end gap-[20px]">
        <span className="text-body-r-12">{price}</span>
        <img
          src="/icons/forword_black.svg"
          alt="더보기"
          width={16}
          height={16}
        />
      </div>
    </button>
  );
}
