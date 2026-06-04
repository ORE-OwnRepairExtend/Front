import closeIcon from "../../assets/icons/close.svg";

type OcrConfirmForm = {
  brandName: string;
  productName: string;
  modelNumber: string;
};

type OcrConfirmModalProps = {
  open: boolean;
  form: OcrConfirmForm;
  onChange: (key: keyof OcrConfirmForm, value: string) => void;
  onClose?: () => void;
  onSubmit?: () => void;
};

export type { OcrConfirmForm };

export default function OcrConfirmModal({
  open,
  form,
  onChange,
  onClose,
  onSubmit,
}: OcrConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-01/80">
      <div className="flex h-[500px] w-[400px] shrink-0 flex-col items-center justify-center gap-[40px] rounded-[20px] bg-secondary-01 py-[30px]">
        {/* 닫기 버튼 */}
        <div className="flex w-full items-center justify-end gap-[10px] px-[28px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[24px] w-[24px] cursor-pointer"
          >
            <img src={closeIcon} alt="닫기" width={24} height={24} />
          </button>
        </div>

        {/* 모달 내부 컨텐츠 */}
        <div className="flex flex-1 flex-col items-center self-stretch px-[50px]">
          {/* 제목 */}
          <p className="self-stretch text-center text-title-main text-primary-01">
            제품 등록
          </p>

          {/* 입력 영역 */}
          <div className="flex flex-1 flex-col items-center justify-center gap-[20px] self-stretch">
            <div className="flex w-full items-center gap-[15px]">
              <label className="w-[65px] shrink-0 text-body-sb-20">
                모델명
              </label>

              <input
                type="text"
                value={form.modelNumber}
                onChange={(e) => onChange("modelNumber", e.target.value)}
                placeholder="모델명을 입력해주세요"
                className="h-[32px] min-w-0 flex-1 rounded-[10px] border border-primary-01 bg-transparent px-[14px] text-body-m-16 outline-none placeholder:text-gray-01"
              />
            </div>

            <div className="flex w-full items-center gap-[15px]">
              <label className="w-[65px] shrink-0 text-body-sb-20">
                제조사
              </label>

              <input
                type="text"
                value={form.brandName}
                onChange={(e) => onChange("brandName", e.target.value)}
                placeholder="제조사를 입력해주세요"
                className="h-[32px] min-w-0 flex-1 rounded-[10px] border border-primary-01 bg-transparent px-[14px] text-body-m-16 outline-none placeholder:text-gray-01"
              />
            </div>

            <div className="flex w-full items-center gap-[15px]">
              <label className="w-[65px] shrink-0 text-body-sb-20">
                제품명
              </label>

              <input
                type="text"
                value={form.productName}
                onChange={(e) => onChange("productName", e.target.value)}
                placeholder="제품명을 입력해주세요"
                className="h-[32px] min-w-0 flex-1 rounded-[10px] border border-primary-01 bg-transparent px-[14px] text-body-m-16 outline-none placeholder:text-gray-01"
              />
            </div>
          </div>

          {/* 등록 버튼 */}
          <button
            type="button"
            onClick={onSubmit}
            className="flex h-[50px] mb-[53px] w-full cursor-pointer items-center justify-center rounded-[20px] bg-secondary-03 text-button-b-20 text-white"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
