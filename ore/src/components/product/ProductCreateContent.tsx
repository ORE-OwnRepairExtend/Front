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

type ProductCreateContentProps = {
  extractedData?: ExtractedProductData | null;
};

export default function ProductCreateContent({
  extractedData,
}: ProductCreateContentProps) {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [productName, setProductName] = useState(
    extractedData?.modelNumber ?? "",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [manual, setManual] = useState(extractedData?.ocrText ?? "");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [noWarranty, setNoWarranty] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);

  // const [parts, setParts] = useState<PartItem[]>([]);

  const [alertMessage, setAlertMessage] = useState("");

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const categories = productCategories.slice(2);

  const isRequiredFilled =
    productName.trim() !== "" &&
    selectedCategory !== "" &&
    manual.trim() !== "" &&
    purchaseDate !== "" &&
    (noWarranty || warrantyPeriod.trim() !== "");

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
    try {
      const requestBody = {
        ...(extractedData?.sourceId && {
          sourceId: extractedData.sourceId,
        }),
        name: productName,
        category: CATEGORY_MAP[selectedCategory as keyof typeof CATEGORY_MAP],
        nickname: nickname.trim() || productName.trim(),
        purchaseDate,
        warrantyMonths: noWarranty ? 0 : Number(warrantyPeriod),
        manual: {
          manualContent: manual,
        },
        // part
        // image
      };

      await api.post("/products", requestBody);

      navigate("/products");
    } catch (error) {
      console.error("제품 등록 실패:", error);
      setAlertMessage("제품 등록에 실패했습니다. 다시 시도해주세요.");
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
            <ProductImageButton onFileSelect={setProductImage} />
          </ProductFormRow>

          {/* 매뉴얼 */}
          <ProductFormRow label="매뉴얼" required>
            <ProductInputBox
              multiline
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="사용 방법을 입력해주세요"
              className="w-full"
            />
          </ProductFormRow>

          {/* 구매일 */}
          <ProductFormRow label="구매일" required>
            {" "}
            <ProductInputBox
              variant="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-[150px]"
            />
          </ProductFormRow>

          {/* 보증기간 */}
          <ProductFormRow label="보증기간" required>
            <div className="flex gap-[60px]">
              <ProductInputBox
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                suffix="개월"
                disabled={noWarranty}
                className="w-[100px]"
                inputClassName={
                  noWarranty ? "cursor-not-allowed text-gray-02" : ""
                }
              />
              <ProductCheckbox
                checked={noWarranty}
                onChange={(checked) => {
                  setNoWarranty(checked);

                  if (checked) {
                    setWarrantyPeriod("");
                  }
                }}
                label="보증 없음"
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
          등록
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
        title="제품을 등록하시겠습니까?"
        onClose={() => setIsSubmitModalOpen(false)}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={async () => {
          await handleSubmit();
          setIsSubmitModalOpen(false);
        }}
        cancelText="취소"
        confirmText="등록"
      />
    </section>
  );
}
