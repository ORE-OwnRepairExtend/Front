import { useState } from "react";
import ProductInputBox from "./ProductInputBox";
import ProductImageButton from "./ProductImageButton";
import ProductCreateCategory from "./ProductCreateCategory";
import CommonButton from "../common/CommonButton";
import PartInputRow from "./PartInputRow";
import ProductCheckbox from "./ProductCheckbox";
import ProductFormRow from "./ProductFormRow";

type PartItem = {
  id: number;
  name: string;
  cycle: string;
};

const categories = [
  "모바일 기기",
  "주방 가전",
  "전자 제품",
  "전자 제품",
  "전자 제품",
  "전자 제품",
  "전자 제품",
  "전자 제품",
];

export default function ProductCreateContent() {
  const [nickname, setNickname] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [manual, setManual] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [noWarranty, setNoWarranty] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);

  const [parts, setParts] = useState<PartItem[]>([]);

  const handlePartChange = (
    id: number,
    field: "name" | "cycle",
    value: string,
  ) => {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, [field]: value } : part)),
    );
  };

  const handleAddPart = () => {
    setParts((prev) => [...prev, { id: Date.now(), name: "", cycle: "" }]);
  };

  const handleDeletePart = (id: number) => {
    setParts((prev) => prev.filter((part) => part.id !== id));
  };

  const handleSubmit = () => {
    console.log({
      nickname,
      productName,
      selectedCategory,
      manual,
      purchaseDate,
      warrantyPeriod: noWarranty ? null : warrantyPeriod,
      noWarranty,
      productImage,
      parts,
    });
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-[3px]">
        <div className="flex w-full px-[15px] py-[10px] text-body-sb-20 text-gray-01">
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
              {categories.map((category, index) => (
                <ProductCreateCategory
                  key={`${category}-${index}`}
                  label={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
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

          {/* 부품 관리 */}
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
          </ProductFormRow>
        </div>
      </div>

      <div className="flex px-[15px] py-[10px]">
        <CommonButton
          variant="secondary"
          onClick={handleSubmit}
          className="w-full"
        >
          등록
        </CommonButton>
      </div>
    </section>
  );
}
