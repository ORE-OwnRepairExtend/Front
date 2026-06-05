import closeIcon from "../../assets/icons/close.svg";

type ProductNotificationCompleteModalProps = {
  open: boolean;
  title: string;
  date: string;
  completeDate: string;
  onChangeCompleteDate: (value: string) => void;
  onClose: () => void;
  onCompleteOnly: () => void;
  onRepairHistoryRegister: () => void;
};

export default function ProductNotificationCompleteModal({
  open,
  title,
  date,
  completeDate,
  onChangeCompleteDate,
  onClose,
  onCompleteOnly,
  onRepairHistoryRegister,
}: ProductNotificationCompleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-01/80">
      <div className="relative flex h-[330px] w-[360px] flex-col items-center rounded-[12px] bg-secondary-01 px-[45px] py-[35px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[25px] top-[25px] cursor-pointer"
        >
          <img src={closeIcon} alt="닫기" width={16} height={16} />
        </button>

        <p className="mt-[25px] text-center text-title-b-20 text-black">
          {title}
        </p>

        <p className="mt-[18px] text-center text-body-m-16 text-gray-01">
          {date}
        </p>

        <div className="mt-[18px] flex items-center gap-[20px]">
          <label className="whitespace-nowrap text-title-b-16 text-black">
            완료 날짜
          </label>

          <input
            type="date"
            value={completeDate}
            onChange={(e) => onChangeCompleteDate(e.target.value)}
            className="h-[31px] w-[135px] rounded-[5px] border border-primary-01 bg-transparent px-[12px] text-body-m-16 text-gray-01 outline-none placeholder:text-gray-01"
          />
        </div>

        <button
          type="button"
          onClick={onCompleteOnly}
          className="mt-[30px] flex h-[50px] w-[200px] cursor-pointer items-center justify-center rounded-[20px] bg-primary-01 text-button-main text-white"
        >
          완료만 처리
        </button>

        <button
          type="button"
          onClick={onRepairHistoryRegister}
          className="mt-[12px] flex h-[50px] w-[200px] cursor-pointer items-center justify-center rounded-[20px] bg-secondary-03 text-button-main text-white"
        >
          수리 이력 등록하기
        </button>
      </div>
    </div>
  );
}