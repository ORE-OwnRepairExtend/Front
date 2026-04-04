import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import RepairDetailContent from "../../components/repair/RepairDetailContent";
import SecondLayout from "../../layout/SecondLayout";
import CommonButton from "../../components/common/CommonButton";
import { mockProductListResponse } from "../../mocks/products";

export default function RepairDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const product = mockProductListResponse.find(
    (item) => item.productId === productId,
  );

  // todo: 예외처리 디자인 생각
  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col mt-[21px]">
          <div className="flex flex-col gap-[10px] flex-1 overflow-y-auto no-scrollbar">
            <div className="px-[10px]">
              <ProductCard
                imageSrc={product.imageUrl}
                name={product.nickname}
                description={product.productName}
                actionType="close"
                onClick={() => navigate(`/products/${product.productId}`)}
                onActionClick={() => navigate(-1)}
              />
            </div>

            {/* 구분선 */}
            <div className="w-full h-[2px] bg-gray-01 mt-[21px]" />

            <div className="min-h-0 px-[10px] mt-[25px]">
              <RepairDetailContent
                title="d"
                repairDate="d"
                content="t"
                price="ag"
                shopName="ds"
                receiptImageUrl="df"
              />

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-[10px] px-[10px] py-[15px]">
                <CommonButton variant="secondary">수정</CommonButton>
                <CommonButton>삭제</CommonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
