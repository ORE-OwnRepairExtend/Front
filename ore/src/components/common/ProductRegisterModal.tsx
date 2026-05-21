import { useRef, useState, type ChangeEvent } from "react";

import closeIcon from "../../assets/icons/close.svg";

type SourceType = "RECEIPT" | "SMS" | "STICKER" | "MANUAL";
type ModalStep = "selectMethod" | "selectSourceType" | "preview";

type ProductRegisterModalProps = {
  open: boolean;
  onClose?: () => void;
  onManualClick?: () => void;
  onUploadSubmit?: (file: File, sourceType: SourceType) => void;
};

export default function ProductRegisterModal({
  open,
  onClose,
  onManualClick,
  onUploadSubmit,
}: ProductRegisterModalProps) {
  const [step, setStep] = useState<ModalStep>("selectMethod");
  const [selectedSourceType, setSelectedSourceType] =
    useState<SourceType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!open) return null;

  const handleSelectSourceType = (sourceType: SourceType) => {
    setSelectedSourceType(sourceType);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nextPreviewUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setStep("preview");

    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedSourceType) {
      alert("이미지를 선택해주세요.");
      return;
    }

    onUploadSubmit?.(selectedFile, selectedSourceType);
  };

  const handleClose = () => {
    setStep("selectMethod");
    setSelectedSourceType(null);
    setSelectedFile(null);
    setPreviewUrl("");
    onClose?.();
  };

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
            onClick={handleClose}
            className="
              h-[24px] w-[24px]
              cursor-pointer
            "
          >
            <img src={closeIcon} alt="닫기" width={24} height={24} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

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
            className={`
    flex flex-1 flex-col items-center justify-center
    self-stretch
    ${step === "selectMethod" ? "gap-[40px]" : "gap-[20px]"}
  `}
          >
            {step === "selectMethod" && (
              <>
                <button
                  type="button"
                  onClick={() => setStep("selectSourceType")}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
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
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  수동 입력
                </button>
              </>
            )}

            {step === "selectSourceType" && (
              <>
                <button
                  type="button"
                  onClick={() => handleSelectSourceType("RECEIPT")}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  구매 영수증
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSourceType("SMS")}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  문자 내역
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSourceType("STICKER")}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  제품 라벨 스티커
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSourceType("MANUAL")}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  제품 사용 설명서
                </button>
              </>
            )}

            {step === "preview" && (
              <>
                <div
                  className="
                    group relative h-[170px] w-full
                    overflow-hidden rounded-[10px] bg-white
                  "
                >
                  <img
                    src={previewUrl}
                    alt="업로드 이미지 미리보기"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
                      absolute inset-0
                      hidden items-center justify-center
                      bg-black/40
                      text-button-b-20 text-white
                      cursor-pointer
                      group-hover:flex
                    "
                  >
                    이미지 수정
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="
                    flex h-[50px] w-full
                    items-center justify-center
                    rounded-[20px] bg-secondary-03
                    text-button-b-20 text-white
                    cursor-pointer
                  "
                >
                  등록
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
