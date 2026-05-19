import closeIcon from "../../assets/icons/close.svg";

type ModalType = "alert" | "confirm";

type ModalProps = {
  open: boolean;
  type?: ModalType;
  title: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
};

export default function Modal({
  open,
  type = "confirm",
  title,
  onClose,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "삭제",
}: ModalProps) {
  if (!open) return null;

  const isAlert = type === "alert";

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
          inline-flex h-[250px] w-[500px]
          flex-col items-center justify-center
          rounded-[20px] bg-secondary-01
        "
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="
            absolute right-[20px] top-[20px]
            cursor-pointer
          "
        >
          <img src={closeIcon} alt="닫기" width={30} height={30} />
        </button>

        <div className="flex flex-col items-center justify-center gap-[35px] pt-[20px]">
          {/* 제목 */}
          <p
            className="
            text-title-sb-24
          "
          >
            {title}
          </p>

          {/* 버튼 영역 */}
          <div
            className={`
              flex items-center
              ${isAlert ? "justify-center" : "w-[300px] justify-between"}
            `}
          >
            {!isAlert && (
              <button
                type="button"
                onClick={onCancel}
                className="
                  flex cursor-pointer items-center justify-center gap-[10px]
                  rounded-[15px] bg-secondary-03
                  px-[50px] py-[10px]
                  text-button-b-20 text-white
                "
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={onConfirm}
              className="
                flex cursor-pointer items-center justify-center gap-[10px]
                rounded-[15px] bg-primary-01
                px-[50px] py-[10px]
                text-button-b-20 text-white
              "
            >
              {isAlert ? "확인" : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
