import closeIcon from "../../assets/icons/close.svg";

type RepairAlarmCreateModalProps = {
  open: boolean;
  title?: string;
  alarmTitle: string;
  alarmDate: string;
  isSubmitting?: boolean;
  onChangeAlarmTitle: (value: string) => void;
  onChangeAlarmDate: (value: string) => void;
  onClose?: () => void;
  onSubmit?: () => void;
};

export default function RepairAlarmCreateModal({
  open,
  title = "알림 설정",
  alarmTitle,
  alarmDate,
  isSubmitting = false,
  onChangeAlarmTitle,
  onChangeAlarmDate,
  onClose,
  onSubmit,
}: RepairAlarmCreateModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gray-01/80
      "
    >
      <div
        className="
          relative
          flex h-[400px] w-[500px]
          flex-col items-center
          rounded-[20px] bg-secondary-01
          px-[50px] py-[35px]
        "
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="
            absolute right-[35px] top-[30px]
            cursor-pointer disabled:cursor-default
          "
        >
          <img src={closeIcon} alt="닫기" width={30} height={30} />
        </button>

        {/* 제목 */}
        <p
          className="
            mt-[50px]
            whitespace-pre-line
            text-center
            text-title-b-32
          "
        >
          {title}
        </p>

        {/* 입력 영역 */}
        <div className="mt-[40px] flex flex-col gap-[20px] px-[10px]">
          <div className="flex items-center gap-[20px]">
            <label className="text-title-m-24">알림 이름</label>

            <input
              type="text"
              value={alarmTitle}
              onChange={(e) => onChangeAlarmTitle(e.target.value)}
              placeholder="알림 이름을 입력해주세요."
              disabled={isSubmitting}
              className="
                h-[32px] w-[200px]
                rounded-[10px] border border-primary-01
                bg-transparent px-[14px]
                text-body-m-16
                outline-none
                placeholder:text-gray-01
                disabled:cursor-default
              "
            />
          </div>

          <div className="flex items-center gap-[20px]">
            <label className="text-title-m-24">알림 날짜</label>

            <input
              type="date"
              value={alarmDate}
              onChange={(e) => onChangeAlarmDate(e.target.value)}
              disabled={isSubmitting}
              className="
                h-[32px] w-[200px]
                rounded-[10px] border border-primary-01
                bg-transparent px-[14px]
                text-body-m-16
                outline-none
                placeholder:text-gray-01
                disabled:cursor-default
              "
            />
          </div>
        </div>

        {/* 등록 버튼 */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            mt-[45px]
            flex h-[45px] w-[390px]
            cursor-pointer items-center justify-center
            rounded-[15px] bg-primary-01
            text-button-b-20 text-white
            disabled:cursor-default disabled:opacity-60
          "
        >
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </div>
    </div>
  );
}