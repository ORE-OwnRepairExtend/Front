import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import SecondLayout from "../../layout/SecondLayout";
import ProductDetailContent from "../../components/product/ProductDetailContent";

import { api } from "../../api/api";
import { formatPrice } from "../../utils/formatPrice";
import { getProductStatus } from "../../utils/productStatus";
import { CATEGORY_LABEL_MAP } from "../../constants/productCategories";

import closeIcon from "../../assets/icons/close.svg";
import defaultProductImage from "../../../public/photos/logo.png";

import type { ApiProductCategory } from "../../types/category";

type FamilyLocationState = {
  familyMemberName?: string;
};

type ProductDetailResponse = {
  productId: string;
  productName: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string | null;
  modelNumber: string | null;
  purchaseDate: string;
  warrantyMonths: number;
  isFavorite: boolean;
  hasRepairHistory: boolean;

  manual: {
    manualContent: string;
  } | null;

  createdAt: string;
};

type ProductWarrantyResponse = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

type ProductOfficialManualResponse = {
  manualUrl: string;
  manualSummary: string;
  customerCenter: string;
};

type RepairHistoryResponse = {
  repairId: string;
  date: string;
  title: string;
  cost: number;
  createdAt: string;
};

export default function FamilyProductDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    familyMemberId,
    productId,
  } = useParams();

  const locationState =
    location.state as FamilyLocationState | null;

  const familyMemberName =
    locationState?.familyMemberName ??
    "가족";

  const [
    product,
    setProduct,
  ] =
    useState<ProductDetailResponse | null>(
      null,
    );

  const [
    warranty,
    setWarranty,
  ] =
    useState<ProductWarrantyResponse | null>(
      null,
    );

  const [
    officialManual,
    setOfficialManual,
  ] =
    useState<ProductOfficialManualResponse | null>(
      null,
    );

  const [
    repairHistories,
    setRepairHistories,
  ] =
    useState<RepairHistoryResponse[]>(
      [],
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    const fetchData =
      async () => {
        if (!productId) return;

        try {
          setIsLoading(true);
          setErrorMessage("");

          const productResponse =
            await api.get<ProductDetailResponse>(
              `/products/${productId}`,
            );

          const productData =
            productResponse.data;

          setProduct(productData);

          if (
            productData.hasRepairHistory
          ) {
            try {
              const response =
                await api.get<
                  RepairHistoryResponse[]
                >(
                  `/products/${productId}/repairs`,
                );

              setRepairHistories(
                response.data,
              );
            } catch {
              setRepairHistories([]);
            }
          }

          if (
            productData.warrantyMonths >
            0
          ) {
            try {
              const response =
                await api.get<ProductWarrantyResponse>(
                  `/products/${productId}/warranty`,
                );

              setWarranty(
                response.data,
              );
            } catch {
              setWarranty(null);
            }
          }

          try {
            const response =
              await api.get<ProductOfficialManualResponse>(
                `/products/${productId}/manual`,
              );

            setOfficialManual(
              response.data,
            );
          } catch {
            setOfficialManual(null);
          }
        } catch (error) {
          console.error(
            "가족 제품 상세 조회 실패:",
            error,
          );

          setErrorMessage(
            "제품 정보를 불러오지 못했습니다.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    fetchData();
  }, [productId]);

  if (isLoading) {
    return (
      <SecondLayout>
        <div />
      </SecondLayout>
    );
  }

  if (
    errorMessage ||
    !product
  ) {
    return (
      <SecondLayout>
        <div>
          {errorMessage ||
            "제품을 찾을 수 없습니다."}
        </div>
      </SecondLayout>
    );
  }

  const repairInfoes =
    repairHistories
      .slice(0, 3)
      .map((repair) => ({
        repairId:
          repair.repairId,
        repairName:
          repair.title,
        repairDate:
          repair.date,
        price:
          formatPrice(
            repair.cost,
          ),
      }));

  const maintenanceCategories = [
    {
      id: "battery",
      label: "배터리",
      replacementCycleMonths: 6,
      replacementHistories: [],
    },
    {
      id: "filter",
      label: "필터",
      replacementCycleMonths: 3,
      replacementHistories: [],
    },
  ];

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        {/* Family 전용 헤더 */}
        <div className="relative">
          <div
            className="
              flex min-h-[45px]
              items-end
              justify-between
              pb-[10px]
            "
          >
            <h1 className="text-title-main text-primary-02">
              Family:{" "}
              {familyMemberName}
            </h1>

            <button
              type="button"
              onClick={() =>
                navigate("/family", {
                  state: {
                    selectedMemberId:
                      familyMemberId,
                  },
                })
              }
              className="cursor-pointer"
            >
              <img
                src={closeIcon}
                alt="닫기"
                className="h-[30px] w-[30px]"
              />
            </button>
          </div>

          <div className="h-[2px] w-full bg-gray-02" />
        </div>

        <div
          className="
            mt-[14px]
            flex min-h-0
            flex-1 flex-col
          "
        >
          <div
            className="
              my-[10px]
              flex flex-1
              flex-col items-center
              gap-[10px]
              overflow-y-auto
              no-scrollbar
            "
          >
            <ProductDetailContent
              productId={
                product.productId
              }
              imageSrc={
                product.imageUrl ??
                defaultProductImage
              }
              nickname={
                product.nickname
              }
              productName={
                product.productName
              }
              category={
                CATEGORY_LABEL_MAP[
                  product.category
                ] ??
                product.category
              }
              purchaseDate={
                product.purchaseDate
              }
              status={
                warranty
                  ? getProductStatus(
                      warranty.remainingDays,
                    )
                  : "empty"
              }
              isFavorite={false}
              readOnly
              manualContent={
                product.manual
                  ?.manualContent ??
                null
              }
              warrantyMonths={
                warranty
                  ?.warrantyMonths ??
                null
              }
              warrantyEndDate={
                warranty
                  ?.warrantyEndDate
              }
              remainingDays={
                warranty
                  ?.remainingDays
              }
              maintenanceCategories={
                maintenanceCategories
              }
              repairHistories={
                repairInfoes
              }
              officialUrl={
                officialManual
                  ?.manualUrl
              }
              customerCenter={
                officialManual
                  ?.customerCenter
              }
              repairListPath={
                `/family/${familyMemberId}/products/${productId}/repairs`
              }
              getRepairDetailPath={(
                repairId,
              ) =>
                `/family/${familyMemberId}/products/${productId}/repairs/${repairId}`
              }
              repairNavigationState={{
                familyMemberName,
              }}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}