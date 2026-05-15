import { useRef, useState } from "react";
import type { ProductSummary } from "../../types/product";
import ProductCard from "../common/ProductCard";
import SearchBar from "../header/SearchBar";
import CategoryButton from "../category/CategoryButton";
import { productCategories } from "../../constants/productCategories";

type ProductSelectModalProps = {
  open: boolean;
  products: ProductSummary[];
  onClose: () => void;
  onSelect: (product: ProductSummary) => void;
};

export default function ProductSelectModal({
  open,
  products,
  onClose,
  onSelect,
}: ProductSelectModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartXRef = useRef(0);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!categoryScrollRef.current) return;

    isDraggingRef.current = true;
    dragStartXRef.current = event.pageX - categoryScrollRef.current.offsetLeft;
    scrollStartXRef.current = categoryScrollRef.current.scrollLeft;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !categoryScrollRef.current) return;

    event.preventDefault();

    const currentX = event.pageX - categoryScrollRef.current.offsetLeft;
    const moveX = currentX - dragStartXRef.current;

    categoryScrollRef.current.scrollLeft = scrollStartXRef.current - moveX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  if (!open) return null;

  const filteredProducts = products
    // 카테고리 필터
    .filter((product) => {
      if (!selectedCategory || selectedCategory === "All") {
        return true;
      }

      // 즐겨찾기
      if (selectedCategory === "즐겨찾기") {
        return product.isFavorite;
      }

      // 일반 카테고리
      return product.category === selectedCategory;
    })
    // 검색 필터
    .filter((product) =>
      `${product.nickname} ${product.productName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-01/80">
      <div className="flex w-[400px] h-full flex-col rounded-[20px] bg-secondary-01">
        {/* 상단 헤더 */}
        <div
          className="
            flex w-[400px] items-center justify-between
            rounded-t-[20px] bg-secondary-03
            pt-[20px] pb-[10px] pl-[20px] pr-[10px]
          "
        >
          <h2 className="text-title-main text-white">제품 선택</h2>

          <button type="button" onClick={onClose}>
            <img
              src="/icons/close_white.svg"
              alt="닫기"
              width={30}
              height={30}
            />
          </button>
        </div>

        {/* 모달 콘텐츠 */}
        <div
          className="
            flex flex-1 flex-col items-start gap-[20px]
            overflow-hidden px-[10px] py-[20px]
          "
        >
          {/* 검색바 */}
          <div className="w-full [&>div]:!w-full">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search Product..."
            />
          </div>

          {/* 구분선 */}
          <div className="h-[2px] w-full bg-secondary-03" />

          {/* 카테고리 */}
          <div
            ref={categoryScrollRef}
            className="flex w-full cursor-grab overflow-x-auto no-scrollbar active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex w-max gap-[10px]">
              {productCategories.map((category) => (
                <CategoryButton
                  key={category.label}
                  label={category.label}
                  icon={category.icon}
                  isSelected={selectedCategory === category.label}
                  onClick={() => handleCategoryClick(category.label)}
                />
              ))}
            </div>
          </div>

          {/* 제품 카드 리스트 */}
          <div
            className="
              flex flex-1 flex-col items-start gap-[10px]
              self-stretch overflow-y-auto px-[10px] no-scrollbar
            "
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                imageSrc={product.imageUrl}
                name={product.nickname}
                description={product.productName}
                showAction={false}
                className="!p-[10px]"
                onClick={() => onSelect(product)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
