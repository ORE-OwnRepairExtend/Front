import closeIcon from "../../assets/icons/close.svg";

type NotificationStatus = "진행중" | "완료";

type ProductNotificationModalProps = {
  open: boolean;
  title: string;
  date: string;
  status: NotificationStatus;
  onClose: () => void;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ProductNotificationModal({
  open,
  title,
  date,
  status,
  onClose,
  onComplete,
  onEdit,
  onDelete,
}: ProductNotificationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-01/80">
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

        {status === "진행중" && (
          <button
            type="button"
            onClick={onComplete}
            className="mt-[30px] flex h-[38px] w-[274px] cursor-pointer items-center justify-center rounded-[20px] bg-primary-01 text-button-main text-white"
          >
            완료 처리하기
          </button>
        )}

        <div className="mt-[20px] flex w-[274px] items-center justify-between">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-[42px] w-[124px] cursor-pointer items-center justify-center rounded-[20px] bg-secondary-03 text-button-main text-white"
          >
            수정
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-[42px] w-[124px] cursor-pointer items-center justify-center rounded-[20px] bg-secondary-03 text-button-main text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}