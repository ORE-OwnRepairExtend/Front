import { useState } from "react";
import type { ProductSummary } from "../../types/product";
import ProductCard from "../common/ProductCard";
import SearchBar from "../header/SearchBar";
import CategoryButton from "../category/CategoryButton";
import starIcon from "../../assets/star.svg";
import phoneIcon from "../../assets/phone.svg";

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

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };
  if (!open) return null;

  const filteredProducts = products
    // 카테고리 필터
    .filter((product) => {
      if (!selectedCategory) return true;

      if (selectedCategory === "favorite") {
        return product.isFavorite;
      }

      // todo: api 카테고리랑 다시 맞추기
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
          <div className="flex w-full overflow-x-auto no-scrollbar">
            <div className="flex w-max gap-[10px]">
              <CategoryButton
                label="즐겨찾기"
                icon={<img src={starIcon} className="h-[20px] w-[20px]" />}
                isSelected={selectedCategory === "favorite"}
                onClick={() => handleCategoryClick("favorite")}
              />

              <CategoryButton
                label="모바일 기기"
                icon={<img src={phoneIcon} className="h-[20px] w-[20px]" />}
                isSelected={selectedCategory === "mobile"}
                onClick={() => handleCategoryClick("mobile")}
              />

              <CategoryButton
                label="주방 가전"
                icon={<img src={phoneIcon} className="h-[20px] w-[20px]" />}
                isSelected={selectedCategory === "kitchen"}
                onClick={() => handleCategoryClick("kitchen")}
              />
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
