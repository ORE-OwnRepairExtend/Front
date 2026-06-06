import { useState } from "react";
import type { ReactNode } from "react";

import type { ProductStatus } from "../../types/product";
import CommonButton from "../common/CommonButton";
import ProductDetailCard from "./ProductDetailCard";
import ProductDetailInfo from "./ProductDetailInfo";
import type { MaintenanceHistoryItem } from "../../utils/maintenanceDate";
import Modal from "../common/Modal";

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

  imageSrc: string | null;
  nickname: string;
  productName: string;
  category: string;
  purchaseDate: string | null;
  status: ProductStatus;
  isFavorite: boolean;

  manualContent?: string | null;
  manualPdfUrl?: string | null;
  warrantyMonths?: number | null;
  warrantyEndDate?: string;
  remainingDays?: number;
  maintenanceCategories: MaintenanceCategory[];
  notificationInfo?: ReactNode;
  repairHistories: RepairInfoItem[];
  officialUrl?: string;
  customerCenter?: string;

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
  warrantyEndDate,
  remainingDays,
  maintenanceCategories,
  notificationInfo,
  repairHistories,
  officialUrl,
  customerCenter,
  onEditClick,
  onDeleteClick,
  onFavoriteClick,
}: ProductDetailContentProps) {
  const [isMaintenanceEditing, setIsMaintenanceEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showWarrantyInfo =
    purchaseDate !== null &&
    warrantyMonths !== null &&
    warrantyMonths !== undefined &&
    warrantyEndDate !== undefined &&
    remainingDays !== undefined;

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
        showWarrantyInfo={showWarrantyInfo}
        warrantyMonths={warrantyMonths}
        warrantyEndDate={warrantyEndDate}
        remainingDays={remainingDays}
        maintenanceCategories={maintenanceCategories}
        notificationInfo={notificationInfo}
        repairinfos={repairHistories}
        officialUrl={officialUrl}
        customerCenter={customerCenter}
        onMaintenanceEditingChange={setIsMaintenanceEditing}
      />

      {!isMaintenanceEditing && (
        <div className="flex w-full items-center justify-end gap-[10px] px-[10px] pb-[15px]">
          <CommonButton variant="secondary" onClick={onEditClick}>
            수정
          </CommonButton>
          <CommonButton onClick={() => setIsDeleteModalOpen(true)}>
            삭제
          </CommonButton>
        </div>
      )}

      <Modal
        open={isDeleteModalOpen}
        title="해당 제품을 삭제하시겠습니까?"
        onClose={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDeleteClick?.();
        }}
        cancelText="취소"
        confirmText="삭제"
      />
    </div>
  );
}
