import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";

export default function RepairHistoryPage() {
  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <Header title="Repair" />
        <div
          className="flex flex-col gap-[20px] px-[10px] mt-[27px] overflow-x-auto
              no-scrollbar"
        >
          <div className="h-[480px] flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
            <ProductCard
              imageSrc="test"
              name="카메라"
              description="소니카메라"
            />
          </div>
          <AddButton title="수리 이력 등록하기" />
        </div>
      </div>
    </MainLayout>
  );
}
