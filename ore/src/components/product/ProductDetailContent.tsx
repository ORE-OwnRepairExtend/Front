import type { ProductStatus } from "../../types/product";
import CommonButton from "../common/CommonButton";
import ProductDetailCard from "./ProductDetailCard";
import ProductDetailInfo from "./ProductDetailInfo";
import type { MaintenanceHistoryItem } from "../../utils/maintenanceDate";

type MaintenanceCategory = {
  id: string;
  label: string;
  replacementCycleMonths: number;
  replacementHistories: MaintenanceHistoryItem[];
};

type RepairInfoItem = {
  repairId: string;
  repairName: string;
  repairDate: string;
  price: string;
};

type ProductDetailContentProps = {
  productId: string;

  imageSrc: string;
  nickname: string;
  productName: string;
  category: string;
  purchaseDate: string;
  status: ProductStatus;
  isFavorite: boolean;

  manualContent?: string;
  manualPdfUrl?: string;
  warrantyMonths: number;
  maintenanceCategories: MaintenanceCategory[];
  repairHistories: RepairInfoItem[];
  officialUrl?: string;
  customerServiceUrl?: string;

  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onFavoriteClick?: () => void;
};

export default function ProductDetailContent({
  productId,
  imageSrc,
  nickname,
  productName,
  category,
  purchaseDate,
  status,
  isFavorite,
  manualContent,
  manualPdfUrl,
  warrantyMonths,
  maintenanceCategories,
  repairHistories,
  officialUrl,
  customerServiceUrl,
  onEditClick,
  onDeleteClick,
  onFavoriteClick,
}: ProductDetailContentProps) {
  return (
    <div className="flex w-full flex-shrink-0 flex-col items-center gap-[20px] px-[10px]">
      <ProductDetailCard
        imageSrc={imageSrc}
        nickname={nickname}
        productName={productName}
        category={category}
        purchaseDate={purchaseDate}
        status={status}
        isFavorite={isFavorite}
        onFavoriteClick={onFavoriteClick}
      />

      <ProductDetailInfo
        productId={productId}
        manualContent={manualContent}
        manualPdfUrl={manualPdfUrl}
        purchaseDate={purchaseDate}
        status={status}
        warrantyMonths={warrantyMonths}
        maintenanceCategories={maintenanceCategories}
        repairinfos={repairHistories}
        officialUrl={officialUrl}
        customerServiceUrl={customerServiceUrl}
      />

      <div className="flex w-full items-center justify-end gap-[10px] px-[10px] pb-[15px]">
        <CommonButton variant="secondary" onClick={onEditClick}>
          수정
        </CommonButton>

        <CommonButton onClick={onDeleteClick}>삭제</CommonButton>
      </div>
    </div>
  );
}
