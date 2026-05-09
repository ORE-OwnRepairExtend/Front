import { useParams } from "react-router-dom";
import { useState } from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductDetailContent from "../../components/product/ProductDetailContent";

import { mockProductListResponse } from "../../mocks/products";
import { mockWarrantyListResponse } from "../../mocks/warranty";
import { mockRepairHistoryResponse } from "../../mocks/repairs";
import { mergeProductsWithWarranty } from "../../utils/productMapper";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductDetailPage() {
  const { productId } = useParams();

  const productsWithStatus = mergeProductsWithWarranty(
    mockProductListResponse,
    mockWarrantyListResponse,
  );

  const product = productsWithStatus.find(
    (item) => item.productId === productId,
  );

  const warrantyInfo = mockWarrantyListResponse.find(
    (item) => item.productId === productId,
  );

  const [isFavorite, setIsFavorite] = useState(product?.isFavorite ?? false);

  if (!product) {
    return <div>제품 정보를 찾을 수 없습니다.</div>;
  }

  const maintenanceCategories = [
    {
      id: "battery",
      label: "배터리",
      replacementCycleMonths: 6,
      replacementHistories: [
        {
          id: "1",
          replacedDate: "2026-06-03",
        },
      ],
    },
    {
      id: "filter",
      label: "필터",
      replacementCycleMonths: 3,
      replacementHistories: [],
    },
  ];

  const repairInfoes = mockRepairHistoryResponse.slice(0, 3).map((repair) => ({
    repairId: repair.repairId,
    repairName: repair.repairContent,
    repairDate: repair.repairDate,
    price: formatPrice(repair.repairCost),
  }));

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="Product" showNotification={false} showCloseButton />

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col">
          <div className="my-[10px] flex flex-1 flex-col items-center gap-[10px] overflow-y-auto no-scrollbar">
            <ProductDetailContent
              productId={product.productId}
              imageSrc={product.imageUrl}
              nickname={product.nickname}
              productName={product.productName}
              category={product.category}
              purchaseDate={product.purchaseDate}
              status={product.status}
              isFavorite={isFavorite}
              manualContent="호환자인 학습 방법과 공부 전략으로는 능동적 학습, 자기 주도 학습, 그룹 스터디와 장점 등이 있습니다."
              manualPdfUrl="https://example.com/manual.pdf"
              warrantyMonths={warrantyInfo?.warrantyMonths ?? 0}
              maintenanceCategories={maintenanceCategories}
              repairHistories={repairInfoes}
              officialUrl="https://example.com"
              customerServiceUrl="https://example.com/customer"
              onFavoriteClick={() => setIsFavorite((prev) => !prev)}
              onEditClick={() => console.log("수정")}
              onDeleteClick={() => console.log("삭제")}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
