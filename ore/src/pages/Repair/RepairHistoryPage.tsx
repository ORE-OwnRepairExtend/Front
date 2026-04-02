import { useNavigate, useParams } from "react-router-dom";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductCard from "../../components/common/ProductCard";
import { mockProductListResponse } from "../../mocks/products";
import AddButton from "../../components/common/AddButton";
import RepairHistoryCard from "../../components/repair/RepairHistoryCard";
import { mockRepairHistoryResponse } from "../../mocks/repairs";
import { formatPrice } from "../../utils/formatPrice";

export default function RepairHistoryPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const product = mockProductListResponse.find(
    (item) => item.productId === productId,
  );

  const repairHistoryList = mockRepairHistoryResponse;

  // todo: 예외처리 디자인 생각
  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col px-[10px] mt-[24px]">
          <ProductCard
            imageSrc={product.imageUrl}
            name={product.nickname}
            description={product.productName}
            actionType="close"
            onActionClick={() => navigate(-1)}
          />

          <div className="flex flex-col flex-1 min-h-0 gap-[20px] px-[10px] mt-[11px]">
            <div className="flex flex-col gap-[10px] flex-1 overflow-y-auto no-scrollbar">
              {repairHistoryList.map((item) => (
                <RepairHistoryCard
                  key={item.repairId}
                  repairName={item.repairContent}
                  repairDate={item.repairDate.replaceAll("-", ".")}
                  price={formatPrice(item.repairCost)}
                  onClick={() => {
                    console.log(item.repairId);
                  }}
                />
              ))}
            </div>

            <AddButton title="수리 이력 등록하기" />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
