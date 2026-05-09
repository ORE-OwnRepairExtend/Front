import {
  getVisibleWarrantyTimeline,
  getWarrantyExpiredDate,
} from "../../utils/warrantyDate";
import { formatDate } from "../../utils/formatDate";
import type { ProductStatus } from "../../types/product";

type ProductWarrantyInfoProps = {
  purchaseDate: string;
  warrantyMonths: number;
};

const STATUS_STYLE: Record<ProductStatus, string> = {
  valid: "bg-point-03",
  imminent: "bg-point-02",
  danger: "bg-point-01",
  expired: "bg-gray-01",
};

export default function ProductWarrantyInfo({
  purchaseDate,
  warrantyMonths,
}: ProductWarrantyInfoProps) {
  const expiredDate = getWarrantyExpiredDate(purchaseDate, warrantyMonths);
  const timeline = getVisibleWarrantyTimeline(
    purchaseDate,
    warrantyMonths,
  ).reverse();
  return (
    <section className="flex w-full flex-col items-start gap-[10px] px-[10px]">
      <h3 className="flex w-full items-center text-body-sb-20 text-primary-01">
        보증 정보
      </h3>

      <div className="flex items-center gap-[80px] text-body-m-16">
        <span>구매일 : {formatDate(new Date(purchaseDate))}</span>
        <span>만료일 : {formatDate(expiredDate)}</span>
        <span>보증기간 : {warrantyMonths}개월</span>
      </div>

      <div className="flex w-full items-start gap-[10px] rounded-[30px] bg-white/50 px-[40px] py-[20px]">
        <div className="relative flex flex-col gap-[30px] pl-[10px]">
          {/* 세로 점선 */}
          <div
            className="
      absolute left-[16.5px] top-[10px] h-[calc(100%-20px)]
      border-l-2 border-dashed border-gray-01
    "
          />
          {timeline.map((item) => (
            <div
              key={item.status}
              className="relative flex items-center gap-[10px]"
            >
              {/* 상태 아이콘 */}
              <span
                className={`z-10 h-[15px] w-[15px] rounded-full ${STATUS_STYLE[item.status]}`}
              />

              {/* 텍스트 */}
              <span className="text-body-m-16">
                · {item.label} - {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
