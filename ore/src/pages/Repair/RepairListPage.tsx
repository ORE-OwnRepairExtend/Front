import { useNavigate } from "react-router-dom";
import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";
import { mockProductListResponse } from "../../mocks/products";

export default function RepairListPage() {
  const navigate = useNavigate();

  const repairItems = mockProductListResponse.filter(
    (item) => item.hasRepairHistory,
  );

  return (
    <MainLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-col flex-1 min-h-0 gap-[20px] px-[10px] mt-[27px]">
          <div className="flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
            {repairItems.map((item) => (
              <ProductCard
                key={item.productId}
                imageSrc={item.imageUrl}
                name={item.nickname}
                description={item.productName}
                onClick={() => navigate(`/products/${item.productId}/repairs`)}
              />
            ))}
          </div>

          <AddButton title="수리 이력 등록하기" />
        </div>
      </div>
    </MainLayout>
  );
}
