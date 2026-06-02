import type { ProductStatus } from "../../types/product";

import starFillIcon from "../../assets/icons/star_fill.svg";
import starEmptyIcon from "../../assets/icons/star_empty.svg";

type ProductDetailCardProps = {
  imageSrc: string;
  nickname: string;
  productName: string;
  category: string;
  purchaseDate: string;
  status: ProductStatus;
  isFavorite: boolean;
  onClick?: () => void;
  onFavoriteClick?: () => void;
  className?: string;
};

const statusText: Record<ProductStatus, string> = {
  expired: "만료",
  danger: "위험",
  imminent: "임박",
  valid: "유효",
  empty: "미등록",
};

const statusColor: Record<ProductStatus, string> = {
  expired: "bg-gray-01",
  danger: "bg-point-01",
  imminent: "bg-point-02",
  valid: "bg-point-03",
  empty: "bg-gray-02",
};

export default function ProductDetailCard({
  imageSrc,
  nickname,
  productName,
  category,
  purchaseDate,
  status,
  isFavorite,
  onClick,
  onFavoriteClick,
  className,
}: ProductDetailCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-[190px] w-full items-center gap-[30px]
        rounded-[20px] bg-neutral-01
        px-[30px] py-[20px]
        text-left cursor-pointer
        ${className ?? ""}
      `}
    >
      {/* 제품 이미지 */}
      <div
        className="
          flex h-[150px] w-[150px] shrink-0 items-center justify-center
          overflow-hidden rounded-[20px] bg-white
        "
      >
        <img
          src={imageSrc}
          alt={nickname}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 우측 정보 영역 */}
      <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[10px]">
        {/* 구분선 위쪽 - 메인 정보 */}
        <div className="flex w-full items-start justify-between pr-[10px]">
          {/* 텍스트 영역 */}
          <div className="flex min-w-0 flex-col items-start gap-[5px]">
            <p className="text-title-main text-primary-01">{nickname}</p>

            <div className="flex max-w-full items-start gap-[5px] text-body-m-16 text-gray-01">
              <p className="truncate">{productName}</p>
              <span>·</span>
              <p className="shrink-0">{category}</p>
            </div>
          </div>

          {/* 즐겨찾기 버튼 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick?.();
            }}
            className="h-[30px] w-[30px] shrink-0 cursor-pointer"
          >
            <img
              src={isFavorite ? starFillIcon : starEmptyIcon}
              alt="즐겨찾기"
              className="h-full w-full"
            />
          </button>
        </div>

        {/* 구분선 */}
        <div className="h-[2px] w-full bg-gray-01" />

        {/* 구분선 아래 영역 */}
        <div className="flex flex-col items-start gap-[10px]">
          <p className="text-body-r-16 text-gray-01">구매일 : {purchaseDate}</p>

          <div className="flex items-center justify-center gap-[20px]">
            <span
              className={`
                h-[15px] w-[15px] rounded-full
                ${statusColor[status]}
              `}
            />
            <p className="text-body-r-16 text-gray-01">
              보증상태 - {statusText[status]}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
