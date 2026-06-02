import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import MainLayout from "../../layout/MainLayout";
import Header from "../../components/header/Header";
import ProductInfoCard from "../../components/common/ProductInfoCard";
import { getProductStatus } from "../../utils/productStatus";
import ProductStatistics from "../../components/statistics/ProductStatistics";
import { mockStatisticsProducts } from "../../mocks/mockStatisticsData";
import ProductRegisterModal from "../../components/common/ProductRegisterModal";

const warrantyList = [
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "내폰 - APPLE", remainingDays: 20 },
  { name: "우리집 냉장고 - LG", remainingDays: 40 },
  { name: "에어팟 - APPLE", remainingDays: -3 },
  { name: "에어팟 - APPLE", remainingDays: -3 },
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "카메라 - SONY", remainingDays: 5 },
];

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

export default function MainPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await api.get<Product[]>("/products");

      setProducts(response.data);
    } catch (error) {
      console.error("제품 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDown(false);

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;

    setIsDragging(true);
    e.preventDefault();

    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full min-h-0 flex-col">
        {/* Header */}
        <div className="shrink-0">
          <Header
            title="Own Repair Extend"
            subtitle="더 오래, 더 제대로"
            isMain
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {/* Product 영역 */}
          <div className="bg-neutral-01 rounded-[30px]">
            <div className="flex justify-between items-center px-[20px] pt-[20px] mb-[15px]">
              <h2 className="text-title-main text-primary-01">Product</h2>
              <span
                className="text-gray-02 text-body-r-15 mr-[15px] cursor-pointer"
                onClick={() => navigate("/products")}
              >
                MORE &gt;
              </span>
            </div>

            <div className="px-[20px] pb-[20px]">
              <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="
                  flex gap-[15px] items-end
                  overflow-x-auto
                  cursor-grab active:cursor-grabbing
                  select-none
                  no-scrollbar
                "
              >
                {/* + 버튼 */}
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    if (isDragging) return;
                    setIsModalOpen(true);
                  }}
                  className="
                    flex-shrink-0
                    w-[80px] h-[135px]
                    rounded-[20px]
                    border-[3px] border-gray-02
                    flex items-center justify-center
                    cursor-pointer
                    hover:bg-gray-100 transition
                  "
                >
                  <span className="text-[32px] text-gray-02 font-light">+</span>
                </div>

                {/* 제품 카드 */}
                {isLoading ? (
                  <div className="flex h-[135px] w-full items-center justify-center text-gray-02 text-body-r-15">
                    제품 목록을 불러오는 중입니다.
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex h-[135px] w-full items-center justify-center text-gray-02 text-body-r-15">
                    등록된 제품이 없습니다.
                  </div>
                ) : (
                  products.map((item) => (
                    <div
                      key={item.productId}
                      className="flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        if (isDragging) return;
                        navigate(`/products/${item.productId}`);
                      }}
                    >
                      <ProductInfoCard
                        name={item.nickname}
                        img={item.imageUrl || "/photos/camera.png"}
                        desc={item.name}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 아래 영역 */}
          <div className="flex items-start gap-[25px] mt-[20px]">
            {/* Warranty */}
            <div className="w-[320px] bg-white rounded-[30px] p-[20px] flex flex-col">
              <h2 className="text-title-main text-primary-01 mb-[10px]">
                Warranty
              </h2>

              <div className="flex flex-col gap-[10px]">
                {warrantyList.map((item, idx) => {
                  const status = getProductStatus(item.remainingDays);

                  const statusColor =
                    status === "expired"
                      ? "bg-gray-400"
                      : status === "danger"
                        ? "bg-red-500"
                        : status === "imminent"
                          ? "bg-[#D2D53A]"
                          : "bg-green-500";

                  const statusText =
                    status === "expired"
                      ? "보증만료"
                      : status === "danger"
                        ? "보증위험"
                        : status === "imminent"
                          ? "보증임박"
                          : "보증정상";

                  const [title, brand] = item.name.split(" - ");

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b-2 border-gray-02 pb-[5px]"
                    >
                      <span>
                        <span className="text-black text-title-m-16">
                          {title}
                        </span>
                        {brand && (
                          <>
                            <span className="text-gray-01 text-body-r-12">
                              {" "}
                              -{" "}
                            </span>
                            <span className="text-gray-01 text-body-r-12">
                              {brand}
                            </span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-[6px]">
                        <span
                          className={`w-[12px] h-[12px] rounded-full ${statusColor}`}
                        />
                        <span className="text-body-m-10 text-gray-01">
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* statistics */}
            <div className="flex-1 w-full bg-white rounded-[30px] p-[20px] flex flex-col">
              <h2 className="text-title-main text-primary-01">Statistics</h2>

              <div className="mt-[10px] w-full">
                <ProductStatistics products={mockStatisticsProducts} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductRegisterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSubmit={async (file, sourceType) => {
          try {
            const formData = new FormData();

            formData.append("image", file);
            formData.append("sourceType", sourceType);

            const uploadResponse = await api.post("/product-sources", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const sourceId = uploadResponse.data.sourceId;

            const resultResponse = await api.get(`/product-sources/${sourceId}`);

            navigate("/products/new", {
              state: resultResponse.data,
            });

            setIsModalOpen(false);
          } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다.");
          }
        }}
        onManualClick={() => {
          navigate("/products/new");
          setIsModalOpen(false);
        }}
      />
    </MainLayout>
  );
}