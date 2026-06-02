import { formatDate } from "../../utils/formatDate";
import type { ProductStatus } from "../../types/product";

type ProductWarrantyInfoProps = {
  purchaseDate?: string;
  warrantyMonths?: number;
  warrantyEndDate?: string;
  remainingDays?: number;
  status: ProductStatus;
};

const STATUS_STYLE: Record<ProductStatus, string> = {
  valid: "bg-point-03",
  imminent: "bg-point-02",
  danger: "bg-point-01",
  expired: "bg-gray-01",
  empty: "bg-gray-02",
};

const STATUS_LABEL: Record<ProductStatus, string> = {
  valid: "유효",
  imminent: "임박",
  danger: "위험",
  expired: "만료",
  empty: "미등록",
};

const STATUS_ORDER: ProductStatus[] = [
  "valid",
  "imminent",
  "danger",
  "expired",
];

function getWarrantyTimelineFromApi(
  purchaseDate: string,
  warrantyEndDate: string,
  status: ProductStatus,
) {
  const purchase = new Date(purchaseDate);
  const expired = new Date(warrantyEndDate);

  const imminent = new Date(expired);
  imminent.setDate(imminent.getDate() - 31);

  const danger = new Date(expired);
  danger.setDate(danger.getDate() - 7);

  const safeImminent = imminent < purchase ? purchase : imminent;
  const safeDanger = danger < purchase ? purchase : danger;

  const timeline = [
    {
      status: "valid" as ProductStatus,
      label: STATUS_LABEL.valid,
      date: formatDate(purchase),
    },
    {
      status: "imminent" as ProductStatus,
      label: STATUS_LABEL.imminent,
      date: formatDate(safeImminent),
    },
    {
      status: "danger" as ProductStatus,
      label: STATUS_LABEL.danger,
      date: formatDate(safeDanger),
    },
    {
      status: "expired" as ProductStatus,
      label: STATUS_LABEL.expired,
      date: formatDate(expired),
    },
  ];

  const currentIndex = STATUS_ORDER.indexOf(status);

  if (currentIndex === -1) return [];

  return timeline.slice(0, currentIndex + 1).reverse();
}

export default function ProductWarrantyInfo({
  purchaseDate,
  warrantyMonths,
  warrantyEndDate,
  status,
}: ProductWarrantyInfoProps) {
  if (!purchaseDate || !warrantyEndDate || warrantyMonths == null) return null;

  const timeline = getWarrantyTimelineFromApi(
    purchaseDate,
    warrantyEndDate,
    status,
  );

  return (
    <section className="flex w-full flex-col items-start gap-[10px] px-[10px]">
      <h3 className="flex w-full items-center text-body-sb-20 text-primary-01">
        보증 정보
      </h3>

      <div className="flex items-center gap-[80px] text-body-m-16">
        <span>구매일 : {formatDate(new Date(purchaseDate))}</span>
        <span>만료일 : {formatDate(new Date(warrantyEndDate))}</span>
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
              <span
                className={`z-10 h-[15px] w-[15px] rounded-full ${STATUS_STYLE[item.status]}`}
              />

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
