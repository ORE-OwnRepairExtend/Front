import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import RepairDetailContent from "../../components/repair/RepairDetailContent";
import SecondLayout from "../../layout/SecondLayout";
import CommonButton from "../../components/common/CommonButton";
import { mockProductListResponse } from "../../mocks/products";
import { mockRepairDetailResponse } from "../../mocks/repairs";
import { formatPrice } from "../../utils/formatPrice";
import { useState } from "react";
import Modal from "../../components/common/Modal";

export default function RepairDetailPage() {
  const navigate = useNavigate();
  const { productId, repairId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = mockProductListResponse.find(
    (item) => item.productId === productId,
  );

  const repairDetail = mockRepairDetailResponse.find(
    (item) => item.repairId === repairId,
  );

  // 삭제 함수
  const handleDelete = () => {
    console.log("삭제할 repairId:", repairId);

    // todo: api 연동 후 변경
    // await deleteRepair(productId, repairId);

    // 삭제 후 이전 페이지로 이동
    // todo: 삭제 후 페이지 이동 생각
    navigate(-1);
  };

  // todo: 예외처리 디자인 생각
  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  if (!repairDetail) {
    return <div>수리 이력을 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-1 min-h-0 flex-col mt-[24px]">
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
          <div className="w-full h-[2px] bg-gray-02 mt-[21px]" />

          <div className="flex flex-col gap-[10px] my-[10px] flex-1 overflow-y-auto no-scrollbar">
            <div className="min-h-0 px-[10px]">
              <RepairDetailContent
                title={repairDetail.repairTitle}
                repairDate={repairDetail.repairDate.replaceAll("-", ".")}
                content={repairDetail.repairContent}
                price={formatPrice(repairDetail.repairCost)}
                shopName={repairDetail.repairShop}
                receiptImageUrl={repairDetail.receiptImageUrl}
              />

              {/* 하단 버튼 */}
              <div className="flex justify-end gap-[10px] px-[10px] py-[15px]">
                <CommonButton variant="secondary">수정</CommonButton>
                <CommonButton onClick={() => setIsModalOpen(true)}>
                  삭제
                </CommonButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        title="해당 수리 이력을 삭제하시겠습니까?"
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleDelete();
          setIsModalOpen(false);
        }}
        cancelText="취소"
        confirmText="삭제"
      />
    </SecondLayout>
  );
}
