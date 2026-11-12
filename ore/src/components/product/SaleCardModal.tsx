import { useRef, useState } from "react";
import { toPng } from "html-to-image";

import type { SaleCardData } from "../../types/sale";
import SaleSummaryCard from "./SaleSummaryCard";
import CommonButton from "../common/CommonButton";

type SaleCardModalProps = {
  open: boolean;
  onClose: () => void;
  data: SaleCardData;
};

export default function SaleCardModal({
  open,
  onClose,
  data,
}: SaleCardModalProps) {
  const [flipped, setFlipped] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setFlipped(false);
    onClose();
  };

  const handleSave = async () => {
    if (!exportRef.current || isSaving) return;

    try {
      setIsSaving(true);

      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 3,
        backgroundColor: "#FFFFFF",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `ORE_판매요약카드_${data.productName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("판매 카드 이미지 저장 실패:", error);
      alert("이미지 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/20
      "
      onClick={handleClose}
    >
      <div
        className="
          relative flex w-[320px]
          flex-col items-center
          rounded-[16px]
          bg-secondary-01
          px-[20px] pb-[20px] pt-[35px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={handleClose}
          className="
            absolute right-[15px] top-[12px]
            cursor-pointer
            text-[20px] text-primary-01
          "
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="mb-[15px] text-title-main text-primary-01">
          판매 요약 카드
        </h2>

        {/* 회전 카드 */}
        <div
          className="cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={() => setFlipped((prev) => !prev)}
        >
          <div
            className="
              relative h-[350px] w-[260px]
              transition-transform duration-700
            "
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* 앞면 */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <SaleSummaryCard data={data} side="front" />
            </div>

            {/* 뒷면 */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <SaleSummaryCard data={data} side="back" />
            </div>
          </div>
        </div>

        {/* 이미지 저장 */}
        <div className="mt-[15px]">
          <CommonButton onClick={handleSave}>
            {isSaving ? "저장 중..." : "이미지 저장하기"}
          </CommonButton>
        </div>

        {/* 이미지 저장 전용 영역 */}
        <div
          className="
            pointer-events-none
            fixed left-[-10000px] top-0
          "
        >
          <div ref={exportRef} className="flex gap-[20px] bg-white p-[20px]">
            <SaleSummaryCard data={data} side="front" />
            <SaleSummaryCard data={data} side="back" />
          </div>
        </div>
      </div>
    </div>
  );
}
