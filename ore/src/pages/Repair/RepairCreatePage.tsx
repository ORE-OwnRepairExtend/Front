import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import { useState } from "react";
import type { ProductSummary } from "../../types/product";
import CommonButton from "../../components/common/CommonButton";
import ProductCard from "../../components/common/ProductCard";
import ProductSelectModal from "../../components/repair/ProductSelectModal";
import { mockProductListResponse } from "../../mocks/products";
import RepairDetailContent from "../../components/repair/RepairDetailContent";
import Modal from "../../components/common/Modal";

export default function RepairCreatePage() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const products = mockProductListResponse;
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(
    null,
  );

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    repairDate: "",
    content: "",
    price: "",
    shopName: "",
    receiptImage: null as File | null,
  });

  const handleSubmit = () => {
    if (!selectedProduct) {
      alert("제품을 선택해주세요.");
      return;
    }

    if (!form.title || !form.repairDate || !form.content) {
      alert("필수 입력값을 모두 입력해주세요.");
      return;
    }

    const payload = {
      productId: selectedProduct.productId,
      title: form.title,
      repairDate: form.repairDate,
      content: form.content,
      price: form.price,
      shopName: form.shopName,
      receiptImage: form.receiptImage,
    };

    console.log("등록 payload:", payload);

    // todo:api연결
  };

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col mt-[14px]">
          <div className="flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
            <div>
              {/* 제품 선택 영역 */}
              <section className="flex min-h-[120px] items-center justify-center rounded-[20px] bg-primary-04">
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
                    showAction={false}
                    onClick={() => setIsProductModalOpen(true)}
                  />
                )}
              </section>

              {/* 제품 선택 모달 */}
              <ProductSelectModal
                open={isProductModalOpen}
                products={products}
                onClose={() => setIsProductModalOpen(false)}
                onSelect={(product) => {
                  setSelectedProduct(product);
                  setIsProductModalOpen(false);
                }}
              />
            </div>
            <div className="min-h-0 px-[10px]">
              {/* 수리 이력 입력폼 */}
              <RepairDetailContent
                isEditMode={true}
                title={form.title}
                repairDate={form.repairDate}
                content={form.content}
                price={form.price}
                shopName={form.shopName}
                receiptImageUrl={
                  form.receiptImage
                    ? URL.createObjectURL(form.receiptImage)
                    : undefined
                }
                onTitleChange={(v) => setForm((p) => ({ ...p, title: v }))}
                onRepairDateChange={(v) =>
                  setForm((p) => ({ ...p, repairDate: v }))
                }
                onContentChange={(v) => setForm((p) => ({ ...p, content: v }))}
                onPriceChange={(v) => setForm((p) => ({ ...p, price: v }))}
                onShopNameChange={(v) =>
                  setForm((p) => ({ ...p, shopName: v }))
                }
                onReceiptImageChange={(file) =>
                  setForm((p) => ({ ...p, receiptImage: file }))
                }
              />

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-[10px] px-[10px] py-[15px]">
                <CommonButton onClick={() => setIsSubmitModalOpen(true)}>
                  등록
                </CommonButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isSubmitModalOpen}
        title="수리 이력을 등록하시겠습니까?"
        onClose={() => setIsSubmitModalOpen(false)}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {
          handleSubmit();
          setIsSubmitModalOpen(false);
        }}
        cancelText="취소"
        confirmText="등록"
      />
    </SecondLayout>
  );
}
