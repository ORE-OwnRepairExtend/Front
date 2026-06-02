import forwardIcon from "../../assets/icons/forword.svg";
import closeIcon from "../../assets/icons/close.svg";

import defaultLogoImage from "../../../public/photos/logo.png";

type ProductCardProps = {
  imageSrc?: string | null;
  name: string;
  description: string;
  actionType?: "arrow" | "close";
  showAction?: boolean;
  className?: string;
  onClick?: () => void;
  onActionClick?: () => void;
};
export default function ProductCard({
  imageSrc,
  name,
  description,
  actionType = "arrow",
  showAction = true,
  className,
  onClick,
  onActionClick,
}: ProductCardProps) {
  const displayImageSrc = imageSrc || defaultLogoImage;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center gap-[30px]
        rounded-[20px] bg-neutral-01
        px-[30px] py-[20px]
        text-left
        cursor-pointer
        ${className ?? ""}
      `}
    >
      {/* 제품이미지 */}
      <div
        className="
          flex h-[100px] w-[100px] shrink-0 items-center justify-center
          rounded-[20px]
          overflow-hidden
        "
      >
        <img
          src={displayImageSrc}
          alt={name}
          className="h-full w-full object-full"
        />
      </div>

      {/* 제품설명 */}
      <div className="flex flex-col items-start flex-[1_0_0] gap-[10px] min-w-0">
        <p className="text-title-b-20 text-primary-01">{name}</p>
        <p className="truncate text-body-r-12 text-gray-01">{description}</p>
      </div>

      {/* 버튼 */}
      {showAction && (
        <div
          className="shrink-0 px-[10px] py-[50px] -mx-[10px] -my-[50px]"
          onClick={(e) => {
            if (actionType === "close") {
              e.stopPropagation();
              onActionClick?.();
            }
          }}
        >
          {actionType === "arrow" ? (
            <img src={forwardIcon} alt="더보기" width={24} height={24} />
          ) : (
            <img src={closeIcon} alt="닫기" width={24} height={24} />
          )}
        </div>
      )}
    </button>
  );
}
