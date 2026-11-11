import { useEffect } from "react";
import ProductCard from "../common/ProductCard";
import CommonButton from "../common/CommonButton";
import closeIcon from "../../assets/icons/close.svg";
import type { RecallInfo } from "../../types/recall";

type RecallModalProps = {
  open: boolean;
  recall: RecallInfo | null;
  userName?: string;
  usersubName?: string;
  onClose: () => void;
  onHide: () => void;
};

export default function RecallModal({
  open,
  recall,
  userName,
  usersubName,
  onClose,
  onHide,
}: RecallModalProps) {
  // 팝업이 열려 있는 동안 배경 스크롤 방지
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !recall) return null;

  const handleDetailClick = () => {
    try {
      const url = new URL(recall.detailUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        return;
      }

      window.open(url.href, "_blank", "noopener,noreferrer");
    } catch {
      console.error("유효하지 않은 리콜 상세 URL");
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/30
        px-[16px] py-[24px]
      "
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recall-modal-title"
        className="
          flex w-full max-w-[695px]
          max-h-[90dvh] flex-col
          overflow-hidden rounded-[20px]
          bg-white
          shadow-lg
        "
      >
        {/* 헤더 */}
        <div
          className="
            relative flex shrink-0
            h-[64px] items-center justify-center
            bg-secondary-01
          "
        >
          <h2
            id="recall-modal-title"
            className="text-title-main text-primary-01"
          >
            리콜 안내
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="리콜 안내 닫기"
            className="
              absolute right-[20px]
              items-center justify-center
              cursor-pointer
            "
          >
            <img src={closeIcon} alt="닫기" width={24} height={24} />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-[50px] py-[20px]">
          {/* 안내 문구 */}
          <p className="mb-[20px] text-center text-body-sb-20 text-black">
            <span className="text-title-b-20 text-primary-01">
              {userName ? `${userName}님` : "고객님"}
            </span>
            <span className="text-title-b-20 text-primary-01">
              ({usersubName ? `${usersubName}님` : "별명"})
            </span>
            의 제품에 대한 새로운 리콜 안내가 있습니다.
          </p>

          {/* 대상 제품 */}
          <section className="mb-[15px]">
            <h3 className="mb-[5px] text-body-m-16 text-gray-01">대상 제품</h3>

            <ProductCard
              imageSrc={recall.productImageUrl}
              name={recall.productName}
              description={recall.productDescription}
              showAction={false}
              imageSize={100}
            />
          </section>

          {/* 관련 사진 */}
          {recall.images?.some((image) => image.trim() !== "") && (
            <section className="mb-[15px]">
              <h3 className="mb-[5px] text-body-m-16 text-gray-01">
                관련 사진
              </h3>

              <div className="grid grid-cols-2 gap-[10px]">
                {recall.images
                  .filter((image) => image.trim() !== "")
                  .map((image, index) => (
                    <div key={`${image}-${index}`}>
                      <img
                        src={image}
                        alt={`리콜 관련 사진 ${index + 1}`}
                        className=" w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 위해 정보 */}
          <section className="mb-[15px]">
            <h3 className="mb-[5px] text-body-m-16 text-gray-01">위해 정보</h3>

            <ul className="flex flex-col">
              {recall.riskDescription.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex gap-[6px]
                    text-body-r-15 text-black
                    leading-[1.6]
                  "
                >
                  <span className="shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 행동 요령 */}
          <section>
            <h3 className="mb-[5px] text-body-m-16 text-gray-01">행동 요령</h3>

            <ul className="flex flex-col">
              {recall.actionDescription.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex gap-[6px]
                    text-body-r-15 text-black
                    leading-[1.6]
                  "
                >
                  <span className="shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 하단 버튼 */}
        {/* 하단 버튼 */}
        <div
          className="
    flex shrink-0 flex-col gap-[8px]
    bg-white px-[24px] pb-[20px] pt-[12px]
  "
        >
          {/* 리콜 상세 정보 확인 */}
          <CommonButton
            variant="primary"
            onClick={handleDetailClick}
            className="!h-[48px] w-full"
          >
            리콜 상세 정보 확인하기
          </CommonButton>

          {/* 다시 보지 않기 */}
          <CommonButton
            variant="secondary"
            onClick={onHide}
            className="
      !h-[44px] w-full
      !bg-transparent !text-gray-01
      hover:!text-primary-01
    "
          >
            다시 보지 않기
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
