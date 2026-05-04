// import { useParams } from "react-router-dom";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import { useState } from "react";
import type { ProductSummary } from "../../types/product";
import CommonButton from "../../components/common/CommonButton";
import ProductCard from "../../components/common/ProductCard";

export default function RepairCreatePage() {
  // const { productId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(
    null,
  );

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col mt-[14px]">
          {/* 제품 선택 영역 */}
          <section className="flex min-h-[120px] items-center justify-center rounded-[20px] bg-primary-04 px-[30px] py-[20px]">
            {selectedProduct === null ? (
              <div
                className="
                flex w-full h-[140px] items-center gap-[30px]
                rounded-[20px] bg-neutral-01
                px-[30px] py-[20px]
                items-center justify-center
                "
              >
                <CommonButton
                  variant="secondary"
                  onClick={() => setIsProductModalOpen(true)}
                >
                  제품 선택
                </CommonButton>
              </div>
            ) : (
              <ProductCard
                imageSrc={selectedProduct.imageUrl}
                name={selectedProduct.nickname}
                description={selectedProduct.productName}
                onClick={() => setIsProductModalOpen(true)}
              />
            )}
          </section>

          {/* 제품 선택 모달 */}
        </div>
      </div>
    </SecondLayout>
  );
}
