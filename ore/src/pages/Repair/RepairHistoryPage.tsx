import { useNavigate, useParams } from "react-router-dom";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductCard from "../../components/common/ProductCard";
import { mockProductListResponse } from "../../mocks/products";
import AddButton from "../../components/common/AddButton";
import RepairHistoryCard from "../../components/repair/RepairHistoryCard";
import { formatPrice } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import { api } from "../../api/api";

type RepairHistory = {
  repairId: string;
  date: string;
  title: string;
  cost: number;
  createdAt: string;
};

export default function RepairHistoryPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [repairHistoryList, setRepairHistoryList] = useState<RepairHistory[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const product = mockProductListResponse.find(
    (item) => item.productId === productId,
  );

  // todo: 예외처리 디자인 생각

  useEffect(() => {
    if (!productId) return;

    const fetchRepairHistoryList = async () => {
      try {
        setIsLoading(true);

        const response = await api.get<RepairHistory[]>(
          `/products/${productId}/repairs`,
        );

        setRepairHistoryList(response.data);
      } catch (error) {
        console.error("수리 이력 목록 조회 실패:", error);
        alert("수리 이력 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairHistoryList();
  }, [productId]);

  if (!product) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="mt-[24px] flex min-h-0 flex-1 flex-col px-[10px]">
          <ProductCard
            imageSrc={product.imageUrl}
            name={product.nickname}
            description={product.productName}
            actionType="close"
            onClick={() => navigate(`/products/${product.productId}`)}
            onActionClick={() => navigate(-1)}
          />

          <div className="mt-[11px] flex min-h-0 flex-1 flex-col gap-[20px] px-[10px]">
            <div className="no-scrollbar flex flex-1 flex-col gap-[10px] overflow-y-auto">
              {isLoading ? (
                <div className="text-gray-02">
                  수리 이력을 불러오는 중입니다.
                </div>
              ) : repairHistoryList.length === 0 ? (
                <div className="text-gray-02">등록된 수리 이력이 없습니다.</div>
              ) : (
                repairHistoryList.map((item) => (
                  <RepairHistoryCard
                    key={item.repairId}
                    repairName={item.title}
                    repairDate={item.date.replaceAll("-", ".")}
                    price={formatPrice(item.cost)}
                    onClick={() => {
                      navigate(
                        `/products/${productId}/repairs/${item.repairId}`,
                      );
                    }}
                  />
                ))
              )}
            </div>

            <AddButton
              title="수리 이력 등록하기"
              onClick={() => navigate(`/products/${productId}/repairs/new`)}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
