import closeIcon from "../../assets/icons/close.svg";

type ProductNotificationEditModalProps = {
  open: boolean;
  alarmTitle: string;
  alarmDate: string;
  onChangeAlarmTitle: (value: string) => void;
  onChangeAlarmDate: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ProductNotificationEditModal({
  open,
  alarmTitle,
  alarmDate,
  onChangeAlarmTitle,
  onChangeAlarmDate,
  onClose,
  onSubmit,
}: ProductNotificationEditModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-01/80">
      <div className="relative flex h-[330px] w-[360px] flex-col items-center rounded-[12px] bg-secondary-01 px-[35px] py-[35px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[25px] top-[25px] cursor-pointer"
        >
          <img src={closeIcon} alt="닫기" width={16} height={16} />
        </button>

        <div className="mt-[55px] flex flex-col gap-[15px]">
          <div className="flex items-center gap-[20px]">
            <label className="w-[65px] text-title-b-16 text-black">
              알림 이름
            </label>

            <input
              type="text"
              value={alarmTitle}
              onChange={(e) => onChangeAlarmTitle(e.target.value)}
              placeholder="알림 이름"
              className="h-[31px] w-[135px] rounded-[5px] border border-primary-01 bg-transparent px-[12px] text-body-m-16 text-gray-01 outline-none placeholder:text-gray-01"
            />
          </div>

          <div className="flex items-center gap-[20px]">
            <label className="w-[65px] text-title-b-16 text-black">
              알림 날짜
            </label>

            <input
              type="date"
              value={alarmDate}
              onChange={(e) => onChangeAlarmDate(e.target.value)}
              className="h-[31px] w-[135px] rounded-[5px] border border-primary-01 bg-transparent px-[12px] text-body-m-16 text-gray-01 outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="mt-[35px] flex h-[31px] w-[220px] cursor-pointer items-center justify-center rounded-[20px] bg-secondary-03 text-button-main text-white"
        >
          저장
        </button>
      </div>
    </div>
  );
}