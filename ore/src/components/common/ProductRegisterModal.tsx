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
          flex h-[500px] w-[400px] py-[30px] shrink-0
          flex-col items-center justify-center gap-[40px]
          rounded-[20px] bg-secondary-01
        "
      >
        {/* 닫기 버튼 */}
        <div
          className="
            flex w-full items-center justify-end
            gap-[10px] px-[28px]
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              h-[24px] w-[24px]
              cursor-pointer
            "
          >
            <img src={closeIcon} alt="닫기" width={24} height={24} />
          </button>
        </div>

        {/* 모달 내부 컨텐츠 */}
        <div
          className="
            flex flex-1 flex-col items-center justify-between
            self-stretch px-[50px]
          "
        >
          {/* 제목 */}
          <p
            className="
            self-stretch text-center
            text-title-main text-primary-01
          "
          >
            제품 등록
          </p>

          {/* 버튼 영역 */}
          <div
            className="
              flex flex-1 flex-col items-center justify-center
              gap-[40px] self-stretch
            "
          >
            <button
              type="button"
              onClick={onUploadClick}
              className="
              flex h-[50px] w-full
              items-center justify-center
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
              flex h-[50px] w-full
              items-center justify-center
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
    </div>
  );
}
