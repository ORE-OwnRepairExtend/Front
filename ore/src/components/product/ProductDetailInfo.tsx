import type { ReactNode } from "react";
import CommonButton from "../common/CommonButton";
import ProductManual from "./ProductManual";
import ProductWarrantyInfo from "./ProductWarrantyInfo";
import type { MaintenanceHistoryItem } from "../../utils/maintenanceDate";
import ProductRepairInfo from "./ProductRepairInfo";
import type { ProductStatus } from "../../types/product";

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

type ProductDetailInfoProps = {
  productId: string;

  manualContent?: string | null;
  manualPdfUrl?: string | null;

  purchaseDate: string | null;
  showWarrantyInfo: boolean;
  warrantyMonths?: number | null;
  warrantyEndDate?: string;
  remainingDays?: number;
  status: ProductStatus;

  maintenanceCategories: MaintenanceCategory[];

  notificationInfo?: ReactNode;

  repairinfos: RepairInfoItem[];

  officialUrl?: string;
  customerCenter?: string;

  onMaintenanceEditingChange?: (
    isEditing: boolean,
  ) => void;

  repairListPath?: string;

  getRepairDetailPath?: (
    repairId: string,
  ) => string;

  repairNavigationState?: unknown;
};

export default function ProductDetailInfo({
  productId,
  manualContent,
  purchaseDate,
  showWarrantyInfo,
  warrantyMonths,
  warrantyEndDate,
  remainingDays,
  status,
  notificationInfo,
  repairinfos,
  officialUrl,
  customerCenter,
  repairListPath,
  getRepairDetailPath,
  repairNavigationState,
}: ProductDetailInfoProps) {
  return (
    <section
      className="
        flex w-full
        flex-col items-center
        gap-[20px]
      "
    >
      <h2
        className="
          w-full text-center
          text-title-main
          text-primary-02
        "
      >
        제품 상세 설명
      </h2>

      <div className="h-[2px] w-full bg-gray-02" />

      <div
        className="
          flex w-full
          flex-col items-center
          gap-[20px]
          px-[10px]
          pt-[15px]
        "
      >
        <ProductManual
          content={manualContent}
        />

        <div className="h-[2px] w-full bg-gray-02/50" />

        {showWarrantyInfo &&
          purchaseDate !== null &&
          warrantyMonths !== null &&
          warrantyMonths !== undefined &&
          warrantyEndDate !== undefined && (
            <>
              <ProductWarrantyInfo
                purchaseDate={
                  purchaseDate
                }
                warrantyMonths={
                  warrantyMonths
                }
                warrantyEndDate={
                  warrantyEndDate
                }
                remainingDays={
                  remainingDays
                }
                status={status}
              />

              <div className="h-[2px] w-full bg-gray-02/50" />
            </>
          )}

        {notificationInfo && (
          <>
            {notificationInfo}

            <div className="h-[2px] w-full bg-gray-02/50" />
          </>
        )}

        <ProductRepairInfo
          productId={productId}
          repairHistories={
            repairinfos
          }
          repairListPath={
            repairListPath
          }
          getRepairDetailPath={
            getRepairDetailPath
          }
          navigationState={
            repairNavigationState
          }
        />

        <div className="h-[2px] w-full bg-gray-02/50" />

        {(officialUrl ||
          customerCenter) && (
          <div className="flex w-full flex-col gap-[10px]">
            {officialUrl && (
              <CommonButton
                className="w-full"
                onClick={() =>
                  window.open(
                    officialUrl,
                    "_blank",
                  )
                }
              >
                공식 정보
              </CommonButton>
            )}

            {customerCenter && (
              <CommonButton
                className="w-full !cursor-default"
                onClick={undefined}
              >
                {customerCenter}
              </CommonButton>
            )}
          </div>
        )}

        {(officialUrl ||
          customerCenter) && (
          <div className="h-[2px] w-full bg-gray-02/50" />
        )}
      </div>
    </section>
  );
}