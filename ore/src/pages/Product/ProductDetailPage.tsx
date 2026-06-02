import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductDetailContent from "../../components/product/ProductDetailContent";

import { mockRepairHistoryResponse } from "../../mocks/repairs";
import { formatPrice } from "../../utils/formatPrice";
import { api } from "../../api/api";
import { CATEGORY_LABEL_MAP } from "../../constants/productCategories";
import { getProductStatus } from "../../utils/productStatus";

import defaultProductImage from "../../../public/photos/logo.png";
import type { ApiProductCategory } from "../../types/category";

type ProductDetailResponse = {
  productId: string;
  productName: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string | null;
  modelNumber: string | null;
  purchaseDate: string | null;
  warrantyMonths: number | null;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  createdAt: string;
};

type ProductWarrantyResponse = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

export default function ProductDetailPage() {
  const navigate = useNavigate();

  const { productId } = useParams();

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [warranty, setWarranty] = useState<ProductWarrantyResponse | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const productResponse = await api.get<ProductDetailResponse>(
          `/products/${productId}`,
        );

        setProduct(productResponse.data);
        setIsFavorite(productResponse.data.isFavorite);

        const hasWarrantyInfo =
          productResponse.data.purchaseDate !== null &&
          productResponse.data.warrantyMonths !== null;

        if (!hasWarrantyInfo) {
          setWarranty(null);
          return;
        }

        try {
          const warrantyResponse = await api.get<ProductWarrantyResponse>(
            `/products/${productId}/warranty`,
          );

          setWarranty(warrantyResponse.data);
        } catch (warrantyError) {
          console.error("보증 정보 조회 실패:", warrantyError);
          setWarranty(null);
        }
      } catch (error) {
        console.error("제품 상세 조회 실패:", error);
        setErrorMessage("제품 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (isLoading) {
    return <div>제품 정보를 불러오는 중입니다.</div>;
  }

  if (errorMessage || !product) {
    return <div>{errorMessage || "제품 정보를 찾을 수 없습니다."}</div>;
  }

  const maintenanceCategories = [
    {
      id: "battery",
      label: "배터리",
      replacementCycleMonths: 6,
      replacementHistories: [
        {
          id: "1",
          replacedDate: "2026-06-03",
        },
      ],
    },
    {
      id: "filter",
      label: "필터",
      replacementCycleMonths: 3,
      replacementHistories: [],
    },
  ];

  const repairInfoes = mockRepairHistoryResponse.slice(0, 3).map((repair) => ({
    repairId: repair.repairId,
    repairName: repair.repairContent,
    repairDate: repair.repairDate,
    price: formatPrice(repair.repairCost),
  }));

  const handleFavoriteClick = async () => {
    if (!productId || !product) return;

    const nextFavorite = !isFavorite;

    try {
      setIsFavorite(nextFavorite);

      const response = await api.patch<{
        productId: string;
        isFavorite: boolean;
      }>(`/products/${productId}/favorite`, {
        isFavorite: nextFavorite,
      });

      setIsFavorite(response.data.isFavorite);
      setProduct((prev) =>
        prev ? { ...prev, isFavorite: response.data.isFavorite } : prev,
      );
    } catch (error) {
      console.error("즐겨찾기 수정 실패:", error);

      setIsFavorite(isFavorite);
      alert("즐겨찾기 상태 변경에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;

    try {
      await api.delete(`/products/${productId}`);

      navigate("/products", { replace: true });
    } catch (error) {
      console.error("제품 삭제 실패:", error);
      alert("제품 삭제에 실패했습니다.");
    }
  };

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="Product" showNotification={false} showCloseButton />

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col">
          <div className="my-[10px] flex flex-1 flex-col items-center gap-[10px] overflow-y-auto no-scrollbar">
            <ProductDetailContent
              productId={product.productId}
              imageSrc={product.imageUrl ?? defaultProductImage}
              nickname={product.nickname}
              productName={product.productName}
              category={
                CATEGORY_LABEL_MAP[product.category] ?? product.category
              }
              purchaseDate={product.purchaseDate}
              status={
                warranty ? getProductStatus(warranty.remainingDays) : "empty"
              }
              isFavorite={isFavorite}
              manualContent="호환자인 학습 방법과 공부 전략으로는 능동적 학습, 자기 주도 학습, 그룹 스터디와 장점 등이 있습니다."
              manualPdfUrl="https://example.com/manual.pdf"
              warrantyMonths={warranty?.warrantyMonths ?? null}
              warrantyEndDate={warranty?.warrantyEndDate}
              remainingDays={warranty?.remainingDays}
              maintenanceCategories={maintenanceCategories}
              repairHistories={repairInfoes}
              officialUrl="https://example.com"
              customerServiceUrl="https://example.com/customer"
              onFavoriteClick={handleFavoriteClick}
              onEditClick={() => console.log("수정")}
              onDeleteClick={handleDeleteProduct}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
