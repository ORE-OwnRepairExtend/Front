import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";
import { mockProductListResponse } from "../../mocks/products";

export default function RepairHistoryPage() {
  const repairItems = mockProductListResponse.filter(
    (item) => item.hasRepairHistory,
  );

  return (
    <MainLayout>
      <div className="flex h-full flex-col">
        <Header title="Repair" />
        <div
          className="flex flex-col gap-[20px] px-[10px] mt-[27px] overflow-x-auto
              no-scrollbar"
        >
          <div className="h-[480px] flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
            {repairItems.map((item) => (
              <ProductCard
                imageSrc={item.imageUrl}
                name={item.productName}
                description={item.nickname}
              />
            ))}
          </div>
          <AddButton title="수리 이력 등록하기" />
        </div>
      </div>
    </MainLayout>
  );
}
