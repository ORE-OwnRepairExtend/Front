import { useEffect } from "react";
import ProductCard from "../common/ProductCard";
import type { RecallInfo } from "../../types/recall";

type RecallModalProps = {
  open: boolean;
  recall: RecallInfo | null;
  userName?: string;
  onClose: () => void;
  onHide: () => void;
};

export default function RecallModal({
  open,
  recall,
  userName,
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
          flex w-full max-w-[560px]
          max-h-[90dvh] flex-col
          overflow-hidden rounded-[16px]
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
            className="text-title-b-20 text-primary-01"
          >
            리콜 안내
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="리콜 안내 닫기"
            className="
              absolute right-[20px]
              flex h-[32px] w-[32px]
              items-center justify-center
              text-[24px] text-primary-01
              cursor-pointer
            "
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto px-[24px] pt-[20px] pb-[16px]">
          {/* 안내 문구 */}
          <p className="mb-[20px] text-center text-body-m-16 text-black">
            <span className="font-semibold text-primary-01">
              {userName ? `${userName}님` : "고객님"}
            </span>
            의 제품에 대한 새로운 리콜 안내가 있습니다.
          </p>

          {/* 대상 제품 */}
          <section className="mb-[20px]">
            <h3 className="mb-[8px] text-body-m-12 text-gray-01">대상 제품</h3>

            <ProductCard
              imageSrc={recall.productImageUrl}
              name={recall.productName}
              description={recall.productDescription}
              showAction={false}
              imageSize={72}
              className="
                !gap-[16px]
                !rounded-[16px]
                !bg-secondary-01
                !px-[16px] !py-[12px]
                cursor-default
              "
            />
          </section>

          {/* 관련 사진 */}
          <section className="mb-[20px]">
            <h3 className="mb-[8px] text-body-m-12 text-gray-01">관련 사진</h3>

            {recall.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-[8px]">
                {recall.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="
                      aspect-square overflow-hidden
                      rounded-[4px] bg-neutral-01
                    "
                  >
                    <img
                      src={image}
                      alt={`리콜 관련 사진 ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  flex h-[140px] items-center justify-center
                  rounded-[8px] bg-neutral-01
                  text-body-r-12 text-gray-01
                "
              >
                등록된 관련 사진이 없습니다.
              </div>
            )}
          </section>

          {/* 위험 정보 */}
          <section className="mb-[16px]">
            <h3 className="mb-[8px] text-body-m-14 text-black">위험 정보</h3>

            <ul className="flex flex-col gap-[6px]">
              {recall.riskDescription.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex gap-[6px]
                    text-body-r-12 text-gray-01
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
            <h3 className="mb-[8px] text-body-m-14 text-black">행동 요령</h3>

            <ul className="flex flex-col gap-[6px]">
              {recall.actionDescription.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex gap-[6px]
                    text-body-r-12 text-gray-01
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
        <div
          className="
            flex shrink-0 flex-col gap-[8px]
            bg-white px-[24px] pb-[20px] pt-[12px]
          "
        >
          <button
            type="button"
            onClick={handleDetailClick}
            className="
              flex h-[44px] w-full
              items-center justify-center
              rounded-[10px]
              bg-primary-01
              text-body-m-14 text-white
              cursor-pointer
              hover:opacity-90
            "
          >
            리콜 상세 정보 확인하기
          </button>

          <button
            type="button"
            onClick={onHide}
            className="
              flex h-[36px] w-full
              items-center justify-center
              text-body-r-14 text-gray-01
              cursor-pointer
              hover:text-primary-01
            "
          >
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
}
