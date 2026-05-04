import { useState } from "react";
import ProductInputBox from "../../components/product/ProductInputBox";
import ProductImageButton from "../../components/product/ProductImageButton";
import ProductCreateContent from "../../components/product/ProductCreateContent";

export default function ProductCreatePage() {
  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [replacementCycle, setReplacementCycle] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">제품 등록</h1>
      <ProductInputBox
        value=""
        onChange={(e) => setProductName(e.target.value)}
        placeholder="제품명을 입력해주세요"
        className="w-[250px]"
      />
      <ProductInputBox
        variant="date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
        className="w-[120px]"
      />
      <ProductInputBox
        value={warrantyPeriod}
        onChange={(e) => setWarrantyPeriod(e.target.value)}
        suffix="개월"
        className="w-[100px] "
      />
      <ProductInputBox
        value={warrantyPeriod}
        onChange={(e) => setWarrantyPeriod(e.target.value)}
        prefix="부품명"
        className="w-[100px] "
      />
      <ProductInputBox
        value={replacementCycle}
        onChange={(e) => setReplacementCycle(e.target.value)}
        prefix="교체주기"
        suffix="개월"
        className="w-[200px]"
      />
      <ProductInputBox
        multiline
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모를 입력해주세요"
        className="w-full"
      />
      <ProductImageButton />
      <ProductCreateContent />
    </div>
  );
}
