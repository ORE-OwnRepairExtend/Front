type ProductStatus = "expired" | "danger" | "imminent" | "valid";
const STATUS_COLOR_MAP: Record<ProductStatus, string> = {
  expired: "var(--color-gray-01)",
  danger: "var(--color-point-01)",
  imminent: "var(--color-point-02)",
  valid: "var(--color-point-03)",
};

type ProductNameCardProps = {
  name: string;
  description: string;
  variant?: "default" | "withIndicator";
  status?: ProductStatus;
  width?: number;
  onClick?: () => void;
};

export default function ProductNameCard({
  name,
  description,
  variant = "default",
  status,
  onClick,
}: ProductNameCardProps) {
  const isIndicator = variant === "withIndicator";

  const indicatorColor = status ? STATUS_COLOR_MAP[status] : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex rounded-[10px] bg-neutral-04 px-[10px] py-[5px] cursor-pointer
        ${
          isIndicator
            ? "w-[120px] items-center justify-between gap-[20px]"
            : "w-[100px] flex-col items-start justify-center "
        }
      `}
    >
      {/* 제품설명 */}
      <div className="flex flex-col gap-[2px] items-start min-w-0">
        <p className="w-full text-body-sb-12 text-primary-01 text-start truncate">
          {name}
        </p>
        <p className="w-full text-body-r-8 text-gray-01 text-start truncate">
          {description}
        </p>
      </div>

      {/* 보증상태아이콘 */}
      {isIndicator && indicatorColor && (
        <span
          className="h-[10px] w-[10px] shrink-0 rounded-full"
          style={{ backgroundColor: indicatorColor }}
        />
      )}
    </button>
  );
}
