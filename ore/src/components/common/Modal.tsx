type ModalProps = {
  open: boolean;
  title: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
};

export default function Modal({
  open,
  title,
  onClose,
  onCancel,
  onConfirm,
  cancelText = "취소",
  confirmText = "삭제",
}: ModalProps) {
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
          inline-flex h-[300px] w-[600px]
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
          <img src="/icons/close.svg" alt="닫기" width={30} height={30} />
        </button>

        <div className="flex flex-col items-center justify-center gap-[50px] pt-[20px]">
          {/* 제목 */}
          <p
            className="
            text-title-m-32
          "
          >
            {title}
          </p>

          {/* 버튼 영역 */}
          <div
            className="
            flex w-[450px] items-center justify-between px-[30px]
          "
          >
            <button
              type="button"
              onClick={onCancel}
              className="
              flex items-center justify-center gap-[10px]
              rounded-[20px] bg-secondary-03
              px-[70px] py-[20px]
              text-button-b-20 text-white
              cursor-pointer

            "
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="
              flex items-center justify-center gap-[10px]
              rounded-[20px] bg-primary-01
              px-[70px] py-[20px]
              text-button-b-20 text-white
              cursor-pointer
            "
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
