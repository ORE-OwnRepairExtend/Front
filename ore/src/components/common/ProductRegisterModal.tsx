import closeIcon from "../../assets/icons/close.svg";

type ProductRegisterModalProps = {
  open: boolean;
  onClose?: () => void;
  onUploadClick?: () => void;
  onManualClick?: () => void;
};

export default function ProductRegisterModal({
  open,
  onClose,
  onUploadClick,
  onManualClick,
}: ProductRegisterModalProps) {
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
          inline-flex h-[480px] w-[450px]
          flex-col items-center justify-center gap-[40px]
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

        {/* 제목 */}
        <p
          className="
            text-title-main text-primary-01
          "
        >
          제품 등록
        </p>

        {/* 버튼 영역 */}
        <div
          className="
            flex flex-col gap-[20px]
            w-[350px]
          "
        >
          <button
            type="button"
            onClick={onUploadClick}
            className="
              w-full
              rounded-[20px] bg-secondary-03
              py-[20px]
              text-button-b-20 text-white
              cursor-pointer
            "
          >
            이미지 업로드
          </button>

          <button
            type="button"
            onClick={onManualClick}
            className="
              w-full
              rounded-[20px] bg-secondary-03
              py-[20px]
              text-button-b-20 text-white
              cursor-pointer
            "
          >
            수동 입력
          </button>
        </div>
      </div>
    </div>
  );
}
