import type { SaleCardData } from "../../types/sale";

type SaleSummaryCardProps = {
  data: SaleCardData;
  side?: "front" | "back";
};

export default function SaleSummaryCard({
  data,
  side = "front",
}: SaleSummaryCardProps) {
  const isFront = side === "front";

  return (
    <div
      className="
        flex h-[350px] w-[260px]
        flex-col
        rounded-[12px]
        border border-primary-01
        bg-[#F5FAF9]
        px-[14px] py-[12px]
        text-[#333333]
      "
    >
      {/* 상단 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[5px]">
          <div className="h-[10px] w-[10px] rounded-full bg-primary-01" />
          {isFront && (
            <p className="max-w-[190px] text-[9px] font-semibold">
              {data.productName}
            </p>
          )}
        </div>

        <span className="text-[9px] font-semibold text-primary-01">ore</span>
      </div>

      {isFront ? (
        <>
          <p className="mt-[2px] text-[8px]">{data.modelName}</p>

          {/* 점수 */}
          <div className="my-[16px] text-center">
            <span className="text-[22px] font-bold text-[#398B4B]">
              {data.score}점
            </span>
          </div>

          {/* 제품 정보 */}
          <div className="flex flex-col text-[9px]">
            {[
              ["구매일", data.purchaseDate],
              ["사용기간", data.usagePeriod],
              ["수리", `${data.repairCount}회`],
              ["수리 비용", `${data.repairCost.toLocaleString()}원`],
              ["소모품 이력", data.componentReplacement],
              ["리콜", data.recallStatus],
            ].map(([label, value]) => (
              <div
                key={label}
                className="
                  flex justify-between
                  border-b border-[#B5B5B5]
                  py-[3px]
                "
              >
                <span className="text-gray-01">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* AI 요약 */}
          <div className="mt-[10px] text-[9px] leading-[1.5]">
            <p className="mb-[3px] font-semibold">AI 분석</p>
            <p>{data.aiSummary}</p>
          </div>
        </>
      ) : (
        <div className="flex-1" />
      )}

      {/* 하단 */}
      <div className="mt-auto flex justify-between pt-[10px] text-[8px]">
        <span>판매자 : {data.ownerName}</span>
        <span>{data.issuedAt}</span>
      </div>
    </div>
  );
}
