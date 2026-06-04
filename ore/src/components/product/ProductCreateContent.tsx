import { useState } from "react";
import ProductInputBox from "./ProductInputBox";
import ProductImageButton from "./ProductImageButton";
import ProductCreateCategory from "./ProductCreateCategory";
import CommonButton from "../common/CommonButton";
// import PartInputRow from "./PartInputRow";
import ProductCheckbox from "./ProductCheckbox";
import ProductFormRow from "./ProductFormRow";
import Modal from "../common/Modal";
import {
  productCategories,
  CATEGORY_MAP,
} from "../../constants/productCategories";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import type { ApiProductCategory } from "../../types/category";

// type PartItem = {
//   id: number;
//   name: string;
//   cycle: string;
// };

type ExtractedProductData = {
  sourceId: string;
  imageUrl: string;
  ocrText: string;
  modelNumber: string;
  sourceType: "RECEIPT" | "SMS" | "STICKER" | "MANUAL";
  createdAt: string;
};

type EditProductData = {
  productId: string;
  productName: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string | null;
  modelNumber: string | null;
  purchaseDate: string | null;
  warrantyMonths: number | null;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  createdAt: string;
  manualContent?: string | null;
};

type ProductCreateContentProps = {
  extractedData?: ExtractedProductData | null;
  isEditMode?: boolean;
  editProductId?: string | null;
  editProductData?: EditProductData | null;
};

const getCategoryLabel = (apiCategory?: ApiProductCategory | null) => {
  if (!apiCategory) return "";

  const matchedCategory = Object.entries(CATEGORY_MAP).find(
    ([, value]) => value === apiCategory,
  );

  return matchedCategory?.[0] ?? "";
};

export default function ProductCreateContent({
  extractedData,
  isEditMode = false,
  editProductId = null,
  editProductData = null,
}: ProductCreateContentProps) {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(editProductData?.nickname ?? "");
  const [productName, setProductName] = useState(
    editProductData?.productName ?? extractedData?.modelNumber ?? "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    getCategoryLabel(editProductData?.category),
  );
  const [manual, setManual] = useState(
    editProductData?.manualContent ?? extractedData?.ocrText ?? "",
  );

  const [purchaseDate, setPurchaseDate] = useState(
    editProductData?.purchaseDate ?? "",
  );
  const [noPurchaseDate, setNoPurchaseDate] = useState(
    editProductData?.purchaseDate === null,
  );

  const [warrantyPeriod, setWarrantyPeriod] = useState(
    editProductData?.warrantyMonths
      ? String(editProductData.warrantyMonths)
      : "",
  );
  const [noWarranty, setNoWarranty] = useState(
    editProductData?.warrantyMonths === null,
  );

  const [productImage, setProductImage] = useState<File | null>(null);

  // const [parts, setParts] = useState<PartItem[]>([]);

  const [alertMessage, setAlertMessage] = useState("");

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const categories = productCategories.slice(2);

  const isRequiredFilled =
    productName.trim() !== "" &&
    selectedCategory !== "" &&
    (isEditMode || manual.trim() !== "");

  // const handlePartChange = (
  //   id: number,
  //   field: "name" | "cycle",
  //   value: string,
  // ) => {
  //   setParts((prev) =>
  //     prev.map((part) => (part.id === id ? { ...part, [field]: value } : part)),
  //   );
  // };

  // const handleAddPart = () => {
  //   setParts((prev) => [...prev, { id: Date.now(), name: "", cycle: "" }]);
  // };

  // const handleDeletePart = (id: number) => {
  //   setParts((prev) => prev.filter((part) => part.id !== id));
  // };

  const handleSubmit = async () => {
    let createdProductId: string | null = null;

    try {
      const category =
        CATEGORY_MAP[selectedCategory as keyof typeof CATEGORY_MAP];

      const requestBody = {
        ...(extractedData?.sourceId && {
          sourceId: extractedData.sourceId,
        }),
        name: productName.trim(),
        category,
        nickname: nickname.trim() || productName.trim(),
        purchaseDate: noPurchaseDate ? null : purchaseDate,
        warrantyMonths: noWarranty ? null : Number(warrantyPeriod),
        manual: {
          manualContent: manual.trim(),
        },
        // part
        // image
      };

      if (isEditMode && editProductId) {
        const formData = new FormData();

        formData.append("nickname", nickname.trim() || productName.trim());
        formData.append("category", category);

        if (productImage) {
          formData.append("image", productImage);
        }

        await api.patch(`/products/${editProductId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigate(`/products/${editProductId}`);
        return;
      }

      const response = await api.post("/products", requestBody);

      createdProductId = response.data.productId;

      if (!createdProductId) {
        throw new Error("productId가 응답에 없습니다.");
      }

      if (productImage) {
        const formData = new FormData();
        formData.append("image", productImage);

        await api.post(`/products/${createdProductId}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate(`/products/${createdProductId}`);
    } catch (error) {
      console.error(isEditMode ? "제품 수정 실패:" : "제품 등록 실패:", error);

      if (!isEditMode && createdProductId) {
        try {
          await api.delete(`/products/${createdProductId}`);
        } catch (deleteError) {
          console.error("이미지 업로드 실패 후 제품 삭제 실패:", deleteError);
        }
      }

      setAlertMessage(
        isEditMode
          ? "제품 수정에 실패했습니다.\n다시 시도해주세요."
          : "제품 등록에 실패했습니다.\n다시 시도해주세요.",
      );
      setIsAlertModalOpen(true);
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-[3px] ">
        <div className="flex w-full px-[15px] py-[10px] text-body-sb-20 text-gray-01 bg-white">
          제품 정보
        </div>

        <div className="flex flex-col gap-[3px]">
          {/* 별칭 */}
          <ProductFormRow label="별칭">
            <ProductInputBox
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ex. 콩나물"
              className="w-[380px]"
            />
          </ProductFormRow>

          {/* 제품명 */}
          <ProductFormRow label="제품명" required>
            <ProductInputBox
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="ex. APPLE-AirPods Pro 3"
              className="w-[380px]"
              disabled={isEditMode}
              inputClassName={
                isEditMode ? "cursor-not-allowed text-gray-02" : ""
              }
            />
          </ProductFormRow>

          {/* 카테고리 */}
          <ProductFormRow label="카테고리" required>
            <div className="flex flex-wrap gap-[8px]">
              {categories.map((category) => (
                <ProductCreateCategory
                  key={category.label}
                  label={category.label}
                  selected={selectedCategory === category.label}
                  onClick={() => setSelectedCategory(category.label)}
                />
              ))}
            </div>
          </ProductFormRow>

          {/* 제품 대표 이미지 */}
          <ProductFormRow label="제품 대표 이미지">
            <ProductImageButton
              imageUrl={editProductData?.imageUrl ?? extractedData?.imageUrl ?? ""}
              onFileSelect={setProductImage}
            />
          </ProductFormRow>

          {/* 매뉴얼 */}
          <ProductFormRow label="매뉴얼" required={!isEditMode}>
            <ProductInputBox
              multiline
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="사용 방법을 입력해주세요"
              className="w-full"
              disabled={isEditMode}
              inputClassName={
                isEditMode ? "cursor-not-allowed text-gray-02" : ""
              }
            />
          </ProductFormRow>

          {/* 구매일 */}
          <ProductFormRow label="구매일">
            <div className="flex gap-[60px]">
              <ProductInputBox
                variant="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                disabled={isEditMode || noPurchaseDate}
                className="w-[150px]"
                inputClassName={
                  isEditMode || noPurchaseDate
                    ? "cursor-not-allowed text-gray-02"
                    : ""
                }
              />

              <ProductCheckbox
                checked={noPurchaseDate}
                onChange={(checked) => {
                  if (isEditMode) return;

                  setNoPurchaseDate(checked);

                  if (checked) {
                    setPurchaseDate("");
                  }
                }}
                label="정보 없음"
              />
            </div>
          </ProductFormRow>

          {/* 보증기간 */}
          <ProductFormRow label="보증기간">
            <div className="flex gap-[110px]">
              <ProductInputBox
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                suffix="개월"
                disabled={isEditMode || noWarranty}
                className="w-[100px]"
                inputClassName={
                  isEditMode || noWarranty
                    ? "cursor-not-allowed text-gray-02"
                    : ""
                }
              />
              <ProductCheckbox
                checked={noWarranty}
                onChange={(checked) => {
                  if (isEditMode) return;

                  setNoWarranty(checked);

                  if (checked) {
                    setWarrantyPeriod("");
                  }
                }}
                label="정보 없음"
              />
            </div>
          </ProductFormRow>

          {/* 부품 관리
          <ProductFormRow label="부품관리">
            <div className="flex flex-col w-[390px] gap-[10px]">
              {parts.map((part) => (
                <PartInputRow
                  key={part.id}
                  name={part.name}
                  cycle={part.cycle}
                  onNameChange={(value) =>
                    handlePartChange(part.id, "name", value)
                  }
                  onCycleChange={(value) =>
                    handlePartChange(part.id, "cycle", value)
                  }
                  onDelete={() => handleDeletePart(part.id)}
                />
              ))}

              <CommonButton onClick={handleAddPart}>추가하기</CommonButton>
            </div>
          </ProductFormRow> */}
        </div>
      </div>

      <div className="flex px-[15px] py-[10px]">
        <CommonButton
          variant="secondary"
          onClick={() => {
            if (!isRequiredFilled) {
              setAlertMessage("필수 항목을 모두 입력해주세요.");
              setIsAlertModalOpen(true);
              return;
            }

            setIsSubmitModalOpen(true);
          }}
          className="w-full"
        >
          {isEditMode ? "수정" : "등록"}
        </CommonButton>
      </div>

      <Modal
        open={isAlertModalOpen}
        type="alert"
        title={alertMessage}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={() => setIsAlertModalOpen(false)}
        confirmText="확인"
      />

      <Modal
        open={isSubmitModalOpen}
        type="confirm"
        title={
          isEditMode ? "제품을 수정하시겠습니까?" : "제품을 등록하시겠습니까?"
        }
        onClose={() => setIsSubmitModalOpen(false)}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={async () => {
          await handleSubmit();
          setIsSubmitModalOpen(false);
        }}
        cancelText="취소"
        confirmText={isEditMode ? "수정" : "등록"}
      />
    </section>
  );
}