import type { SaleCardData } from "../../types/sale";

import logoIcon from "../../assets/logo_icon.svg";
import logoName from "../../assets/logo_ore.svg";

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
        flex h-full w-full
        flex-col
        rounded-[20px]
        border border-primary-01 border-[2px]
        bg-neutral-04
        px-[30px] py-[20px]
      "
    >
      {/* 상단 */}
      <div className="flex items-start justify-between">
        <img src={logoIcon} alt="로고아이콘" height={15} />
        <img src={logoName} alt="로고이름" height={15} />
      </div>

      {isFront ? (
        <>
          <div>
            <p className="mt-[5px] text-body-sb-16">{data.modelName}</p>
            <p className="text-body-r-12">{data.category}</p>
          </div>

          {/* 점수 */}
          <div className="my-[35px] text-center">
            <span className="text-title-b-32 text-primary-02">
              {data.score}점
            </span>
          </div>

          {/* 제품 정보 */}
          <div className="flex flex-col">
            {[
              ["구매일", data.purchaseDate],
              ["보증 기간", `${data.warrantyPeriod} 까지`],
              ["수리", `${data.repairCount} 회`],
              ["리콜", data.recallStatus],
              ["소유권 이전", data.transferStatus],
            ].map(([label, value]) => (
              <div
                key={label}
                className="
                  flex justify-between
                  border-t border-dashed border-gray-01
                  py-[3px]
                "
              >
                <span className="text-body-r-16 text-gray-01">{label}</span>
                <span className="text-body-m-16">{value}</span>
              </div>
            ))}
          </div>

          {/* AI 요약 */}
          <div
            className="
                  border-t border-dashed border-gray-01
                  py-[3px]
                "
          >
            <p className="text-body-r-16 text-gray-01">AI 분석</p>
            <p className="mt-[5px] text-body-m-16">{data.aiSummary}</p>
          </div>
        </>
      ) : (
        <div className="flex-1" />
      )}

      {/* 하단 */}
      <div className="mt-auto flex justify-between text-body-r-16">
        <span>판매자 : {data.ownerName}</span>
        <span>{data.issuedAt}</span>
      </div>
    </div>
  );
}
