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
import { useParams } from "react-router-dom";

export default function RepairCreatePage() {
  const { productId } = useParams();

  const products = mockProductListResponse;

  const defaultProduct =
    products.find((p) => p.productId === productId) ?? null;

  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(
    null,
  );

  const isFixedProduct = Boolean(productId);
  const currentProduct = selectedProduct ?? defaultProduct;

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [alertModal, setAlertModal] = useState({
    open: false,
    message: "",
  });

  const [form, setForm] = useState({
    title: "",
    repairDate: "",
    content: "",
    price: "",
    shopName: "",
    receiptImage: null as File | null,
  });

  const handleRegisterClick = () => {
    if (!currentProduct) {
      setAlertModal({
        open: true,
        message: "제품을 선택해주세요.",
      });
      return;
    }

    if (!form.title || !form.repairDate || !form.content) {
      setAlertModal({
        open: true,
        message: "수리 이력을 입력해주세요.",
      });
      return;
    }

    setIsSubmitModalOpen(true);
  };

  const handleSubmit = () => {
    if (!currentProduct) return;

    const payload = {
      date: form.repairDate,
      content: form.content,
      cost: Number(form.price),
      imageUrl: form.receiptImage ? URL.createObjectURL(form.receiptImage) : "",
    };

    console.log("등록 productId:", currentProduct.productId);
    console.log("등록 payload:", payload);

    setIsSubmitModalOpen(false);

    // todo: api 연동
    // POST /products/${currentProduct.productId}/repairs
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
                {currentProduct === null ? (
                  <div
                    className="
      flex h-[140px] w-full items-center justify-center gap-[30px]
      rounded-[20px] bg-neutral-01
      px-[30px] py-[20px]
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
                    imageSrc={currentProduct.imageUrl}
                    name={currentProduct.nickname}
                    description={currentProduct.productName}
                    showAction={false}
                    onClick={
                      isFixedProduct
                        ? undefined
                        : () => setIsProductModalOpen(true)
                    }
                    className={
                      isFixedProduct ? "cursor-default pointer-events-none" : ""
                    }
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
                onPriceChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    price: v.replace(/[^0-9]/g, ""),
                  }))
                }
                onShopNameChange={(v) =>
                  setForm((p) => ({ ...p, shopName: v }))
                }
                onReceiptImageChange={(file) =>
                  setForm((p) => ({ ...p, receiptImage: file }))
                }
              />

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-[10px] px-[10px] py-[15px]">
                <CommonButton onClick={handleRegisterClick}>등록</CommonButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 등록확인모달 */}
      <Modal
        open={isSubmitModalOpen}
        title="수리 이력을 등록하시겠습니까?"
        onClose={() => setIsSubmitModalOpen(false)}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {
          handleSubmit();
        }}
        cancelText="취소"
        confirmText="등록"
      />

      {/* alert 모달 */}
      <Modal
        open={alertModal.open}
        type="alert"
        title={alertModal.message}
        onClose={() => setAlertModal({ open: false, message: "" })}
        onConfirm={() => setAlertModal({ open: false, message: "" })}
      />
    </SecondLayout>
  );
}