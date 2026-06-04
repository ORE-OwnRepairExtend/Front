import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import MainLayout from "../../layout/MainLayout";
import Header from "../../components/header/Header";
import ProductInfoCard from "../../components/common/ProductInfoCard";
import { getProductStatus } from "../../utils/productStatus";
import ProductStatistics from "../../components/statistics/ProductStatistics";
import ProductRegisterModal from "../../components/common/ProductRegisterModal";
import type { ProductStatus } from "../../types/product";

type ProductListItem = {
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

type ProductDetail = {
  productId: string;
  productName: string;
  nickname: string;
  category: string;
  imageUrl: string;
  modelNumber: string;
  purchaseDate?: string;
  puchaseDate?: string;
  warrantyMonths?: number;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  createdAt: string;
};

type WarrantyInfo = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

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
  warrantyMonths: number;
  warrantyEndDate: string | null;
  remainingDays: number | null;
  warrantyStatus: ProductStatus;
};

type StatisticsStatus = "expired" | "danger" | "imminent" | "valid" | "none";

type StatisticsProduct = Omit<Product, "warrantyStatus"> & {
  productStatus: StatisticsStatus;
  warrantyStatus: StatisticsStatus;
};

const convertToStatisticsStatus = (status: ProductStatus): StatisticsStatus => {
  return status === "empty" ? "none" : status;
};

const getWarrantyStatusText = (status: ProductStatus) => {
  if (status === "expired") return "보증만료";
  if (status === "danger") return "보증위험";
  if (status === "imminent") return "보증임박";
  if (status === "empty") return "보증없음";

  return "보증유효";
};

const getWarrantyStatusColor = (status: ProductStatus) => {
  if (status === "expired") return "bg-gray-01";
  if (status === "danger") return "bg-point-01";
  if (status === "imminent") return "bg-point-02";
  if (status === "empty") return "bg-gray-02";

  return "bg-point-03";
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

  const fetchWarrantyInfo = async (
    productId: string,
  ): Promise<WarrantyInfo | null> => {
    try {
      const response = await api.get<WarrantyInfo>(
        `/products/${productId}/warranty`,
      );

      return response.data;
    } catch {
      return null;
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const response = await api.get<ProductListItem[]>("/products");

      const productDetails = await Promise.all(
        response.data.map(async (product) => {
          const detailResponse = await api.get<ProductDetail>(
            `/products/${product.productId}`,
          );

          const detail = detailResponse.data;

          const hasWarranty =
            typeof detail.warrantyMonths === "number" &&
            detail.warrantyMonths > 0;

          const warranty = hasWarranty
            ? await fetchWarrantyInfo(product.productId)
            : null;

          const purchaseDate =
            warranty?.purchaseDate ??
            detail.purchaseDate ??
            detail.puchaseDate ??
            product.purchaseDate ??
            "";

          const warrantyMonths =
            warranty?.warrantyMonths ?? detail.warrantyMonths ?? 0;

          const remainingDays = warranty?.remainingDays ?? null;

          return {
            productId: detail.productId,
            name: detail.productName,
            nickname: detail.nickname,
            category: detail.category,
            imageUrl: detail.imageUrl,
            isFavorite: detail.isFavorite,
            hasRepairHistory: detail.hasRepairHistory,
            purchaseDate,
            createdAt: detail.createdAt,
            warrantyMonths,
            warrantyEndDate: warranty?.warrantyEndDate ?? null,
            remainingDays,
            warrantyStatus:
              remainingDays === null ? "empty" : getProductStatus(remainingDays),
          };
        }),
      );

      setProducts(productDetails);
    } catch (error) {
      console.error("제품 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const statisticsProducts = useMemo<StatisticsProduct[]>(() => {
    return products.map((product) => {
      const statisticsStatus = convertToStatisticsStatus(
        product.warrantyStatus,
      );

      return {
        ...product,
        productStatus: statisticsStatus,
        warrantyStatus: statisticsStatus,
      };
    });
  }, [products]);

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
                  <div className="flex h-[135px] min-w-full items-center justify-center text-gray-02 text-body-r-15">
                    제품 목록을 불러오는 중입니다.
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex h-[135px] min-w-full items-center justify-center text-gray-02 text-body-r-15">
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
                        img={item.imageUrl}
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
                {isLoading ? (
                  <div className="flex h-[120px] items-center justify-center text-gray-02 text-body-r-15">
                    보증 정보를 불러오는 중입니다.
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex h-[120px] items-center justify-center text-gray-02 text-body-r-15">
                    등록된 보증 정보가 없습니다.
                  </div>
                ) : (
                  products.map((item) => {
                    const statusColor = getWarrantyStatusColor(
                      item.warrantyStatus,
                    );

                    const statusText = getWarrantyStatusText(
                      item.warrantyStatus,
                    );

                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center border-b-2 border-gray-02 pb-[5px]"
                      >
                        <span>
                          <span className="text-black text-title-m-16">
                            {item.nickname}
                          </span>
                          <span className="text-gray-01 text-body-r-12">
                            {" "}
                            -{" "}
                          </span>
                          <span className="text-gray-01 text-body-r-12">
                            {item.name}
                          </span>
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
                  })
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="flex-1 w-full bg-white rounded-[30px] p-[20px] flex flex-col">
              <h2 className="text-title-main text-primary-01">Statistics</h2>

              <div className="mt-[10px] w-full">
                <ProductStatistics products={statisticsProducts} />
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

            const uploadResponse = await api.post(
              "/product-sources",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            const sourceId = uploadResponse.data.sourceId;

            const resultResponse = await api.get(
              `/product-sources/${sourceId}`,
            );

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