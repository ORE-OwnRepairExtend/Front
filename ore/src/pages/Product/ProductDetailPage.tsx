import { useParams } from "react-router-dom";
import ProductDetailCard from "../../components/product/ProductDetailCard";
import { mockProductListResponse } from "../../mocks/products";
import { mergeProductsWithWarranty } from "../../utils/productMapper";
import { mockWarrantyListResponse } from "../../mocks/warranty";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import { useState } from "react";
import ProductDetailInfo from "../../components/product/ProductDetailInfo";

//테스트코드

export default function ProductDetailPage() {
  const { productId } = useParams();

  const productsWithStatus = mergeProductsWithWarranty(
    mockProductListResponse,
    mockWarrantyListResponse,
  );

  const product = productsWithStatus.find(
    (item) => item.productId === productId,
  );

  const [isFavorite, setIsFavorite] = useState(product?.isFavorite ?? false);

  if (!product) {
    return <div>제품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <Header title="제품 상세" />

      <ProductDetailCard
        imageSrc={product.imageUrl}
        nickname={product.nickname}
        productName={product.productName}
        category={product.category}
        purchaseDate={product.purchaseDate}
        status={product.status}
        isFavorite={isFavorite}
        onFavoriteClick={() => {
          setIsFavorite((prev) => !prev);
        }}
      />
      <ProductDetailInfo
        productId="1"
        manualContent={"manualText"}
        manualPdfUrl="https://example.com/manual.pdf"
        purchaseDate="2025-12-17"
        warrantyMonths={3}
        maintenanceCategories={[
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
        ]}
        repairHistories={[
          {
            repairId: "1",
            repairName: "렌즈 수리",
            repairDate: "2026.03.12",
            price: "64,000원",
          },
        ]}
        officialUrl="https://example.com"
        customerServiceUrl="https://example.com/customer"
      />
    </SecondLayout>
  );
}
