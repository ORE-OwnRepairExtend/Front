import type { ProductSummary } from "../../types/product";
import ProductNameCard from "../common/ProductNameCard";

// type ProductStatus = "expired" | "danger" | "imminent" | "valid";

type FavoriteCardProps = {
  items: ProductSummary[];
  onItemClick?: (item: ProductSummary) => void;
};

export default function FavoriteCard({
  items,
  onItemClick,
}: FavoriteCardProps) {
  return (
    <section className="inline-flex flex-col items-start gap-[15px]">
      {/* 제목 */}
      <h3 className="text-title-b-16 text-gray-01">Favorite</h3>

      {/* 리스트 영역 */}
      <div
        className="
          flex h-[137px] flex-col items-center gap-[10px]
          overflow-y-auto no-scrollbar
        "
      >
        {/* todo : status 계산 반영 */}
        {items.map((item) => (
          <ProductNameCard
            key={item.productId}
            name={item.productName}
            description={item.nickname}
            variant="withIndicator"
            status="danger"
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </section>
  );
}
