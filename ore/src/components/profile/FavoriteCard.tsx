import ProductNameCard from "../common/ProductNameCard";

type ProductStatus = "expired" | "danger" | "imminent" | "valid";

type FavoriteItem = {
  id: number | string;
  name: string;
  description: string;
  status: ProductStatus;
};

type FavoriteCardProps = {
  items: FavoriteItem[];
  onItemClick?: (item: FavoriteItem) => void;
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
        {items.map((item) => (
          <ProductNameCard
            key={item.id}
            name={item.name}
            description={item.description}
            variant="withIndicator"
            status={item.status}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    </section>
  );
}
