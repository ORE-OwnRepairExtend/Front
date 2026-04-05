import { useNavigate } from "react-router-dom";
import type { ProductWithStatus } from "../../types/product";
import ProductNameCard from "../common/ProductNameCard";

type FavoriteCardProps = {
  items: ProductWithStatus[];
  onItemClick?: (item: ProductWithStatus) => void;
};

export default function FavoriteCard({
  items,
  onItemClick,
}: FavoriteCardProps) {
  const navigate = useNavigate();
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
            name={item.nickname}
            description={item.productName}
            variant="withIndicator"
            status={item.status}
            onClick={() => {
              onItemClick?.(item);
              navigate(`/products/${item.productId}`);
            }}
          />
        ))}
      </div>
    </section>
  );
}
