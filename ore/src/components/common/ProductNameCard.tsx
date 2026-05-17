import type { ProductStatus } from "../../types/product";

const STATUS_COLOR_MAP: Record<ProductStatus, string> = {
  expired: "var(--color-gray-01)",
  danger: "var(--color-point-01)",
  imminent: "var(--color-point-02)",
  valid: "var(--color-point-03)",
  empty: "var(--color-gray-02)",
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
            : "w-[100px] flex-col items-start justify-center"
        }
      `}
    >
      <div className="flex min-w-0 flex-col items-start gap-[2px]">
        <p className="w-full truncate text-start text-body-sb-12 text-primary-01">
          {name}
        </p>
        <p className="w-full truncate text-start text-body-r-8 text-gray-01">
          {description}
        </p>
      </div>

      {isIndicator && indicatorColor && (
        <span
          className="h-[10px] w-[10px] shrink-0 rounded-full"
          style={{ backgroundColor: indicatorColor }}
        />
      )}
    </button>
  );
}
