import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";

import cameraImg from "../../assets/camera.png";

type Product = {
  productId: string;
  name: string;
  nickname: string;
  category: string;
  imageUrl: string;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  createdAt: string;
};

export default function RepairListPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await api.get<Product[]>("/products");

      setProducts(response.data);
    } catch (error) {
      console.error("제품 목록 조회 실패:", error);
      alert("제품 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const repairItems = useMemo(() => {
    return products.filter((item) => item.hasRepairHistory);
  }, [products]);

  return (
    <MainLayout>
      <div className="flex h-full min-h-0 flex-col">
        <Header title="Repair" />

        <div className="flex flex-col flex-1 min-h-0 gap-[20px] px-[10px] mt-[24px]">
          <div className="flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-gray-02 text-body-r-15">
                수리 이력 제품을 불러오는 중입니다.
              </div>
            ) : repairItems.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-gray-02 text-body-r-15">
                수리 이력이 있는 제품이 없습니다.
              </div>
            ) : (
              repairItems.map((item) => (
                <ProductCard
                  key={item.productId}
                  imageSrc={item.imageUrl || cameraImg}
                  name={item.nickname}
                  description={item.name}
                  onClick={() => navigate(`/products/${item.productId}/repairs`)}
                />
              ))
            )}
          </div>

          <AddButton
            title="수리 이력 등록하기"
            onClick={() => navigate("/repairs/new")}
          />
        </div>
      </div>
    </MainLayout>
  );
}