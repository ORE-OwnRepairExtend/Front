import CommonButton from "../common/CommonButton";
import ProductManual from "./ProductManual";
import ProductWarrantyInfo from "./ProductWarrantyInfo";
// import ProductMaintenanceInfo from "./ProductMaintenanceInfo";
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

  manualContent?: string;
  manualPdfUrl?: string;

  purchaseDate: string;
  warrantyMonths?: number | null;
  warrantyEndDate?: string;
  remainingDays?: number;
  status: ProductStatus;

  maintenanceCategories: MaintenanceCategory[];

  repairinfos: RepairInfoItem[];

  officialUrl?: string;
  customerServiceUrl?: string;

  onMaintenanceEditingChange?: (isEditing: boolean) => void;
};

export default function ProductDetailInfo({
  productId,
  manualContent,
  manualPdfUrl,
  purchaseDate,
  warrantyMonths,
  warrantyEndDate,
  remainingDays,
  status,
  // maintenanceCategories,
  repairinfos,
  officialUrl,
  customerServiceUrl,
  // onMaintenanceEditingChange,
}: ProductDetailInfoProps) {
  return (
    <section className="flex w-full flex-col items-center gap-[20px]">
      {/* 메인 제목 */}
      <h2 className="w-full text-center text-title-main text-primary-02">
        제품 상세 설명
      </h2>

      {/* 구분선 */}
      <div className="h-[2px] w-full bg-gray-02" />

      {/* 정보 영역 */}
      <div className="flex w-full flex-col items-center gap-[20px] px-[10px] pt-[15px]">
        <ProductManual
          content={manualContent}
          onPdfClick={
            manualPdfUrl ? () => window.open(manualPdfUrl, "_blank") : undefined
          }
        />

        <div className="h-[2px] w-full bg-gray-02/50" />

        <ProductWarrantyInfo
          purchaseDate={purchaseDate}
          warrantyMonths={warrantyMonths}
          warrantyEndDate={warrantyEndDate}
          remainingDays={remainingDays}
          status={status}
        />

        <div className="h-[2px] w-full bg-gray-02/50" />

        {/* <ProductMaintenanceInfo
          purchaseDate={purchaseDate}
          categories={maintenanceCategories}
          onEditingChange={onMaintenanceEditingChange}
        />

        <div className="h-[2px] w-full bg-gray-02/50" /> */}

        <ProductRepairInfo
          productId={productId}
          repairHistories={repairinfos}
        />

        <div className="h-[2px] w-full bg-gray-02/50" />

        {/* 하단 버튼 영역 */}
        {(officialUrl || customerServiceUrl) && (
          <div className="flex w-full flex-col gap-[10px]">
            {officialUrl && (
              <CommonButton
                className="w-full"
                onClick={() => window.open(officialUrl, "_blank")}
              >
                공식 홈페이지
              </CommonButton>
            )}

            {customerServiceUrl && (
              <CommonButton
                className="w-full"
                onClick={() => window.open(customerServiceUrl, "_blank")}
              >
                고객 센터 연결
              </CommonButton>
            )}
          </div>
        )}

        {(officialUrl || customerServiceUrl) && (
          <div className="h-[2px] w-full bg-gray-02/50" />
        )}
      </div>
    </section>
  );
}
