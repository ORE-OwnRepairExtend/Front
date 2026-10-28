import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductCard from "../../components/common/ProductCard";
import RepairDetailContent from "../../components/repair/RepairDetailContent";
import SecondLayout from "../../layout/SecondLayout";

import { formatPrice } from "../../utils/formatPrice";
import { api } from "../../api/api";

import closeIcon from "../../assets/icons/close.svg";

type FamilyLocationState = {
  familyMemberName?: string;
};

type RepairDetailResponse = {
  repairId: string;
  title: string;
  date: string;
  content: string;
  cost: number;
  serviceCenter: string;
  imageUrl?: string;
  createdAt: string;
};

type ProductDetailResponse = {
  productId: string;
  productName: string;
  nickname: string;
  imageUrl?: string | null;
};

export default function FamilyRepairDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    familyMemberId,
    productId,
    repairId,
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
    repairDetail,
    setRepairDetail,
  ] =
    useState<RepairDetailResponse | null>(
      null,
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
        if (
          !productId ||
          !repairId
        ) {
          setErrorMessage(
            "잘못된 접근입니다.",
          );

          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);

          const [
            productResponse,
            repairResponse,
          ] =
            await Promise.all([
              api.get<ProductDetailResponse>(
                `/products/${productId}`,
              ),

              api.get<RepairDetailResponse>(
                `/products/${productId}/repairs/${repairId}`,
              ),
            ]);

          setProduct(
            productResponse.data,
          );

          setRepairDetail(
            repairResponse.data,
          );
        } catch (error) {
          console.error(
            "가족 수리 이력 상세 조회 실패:",
            error,
          );

          setErrorMessage(
            "수리 이력 정보를 불러오지 못했습니다.",
          );
        } finally {
          setIsLoading(false);
        }
      };

    fetchData();
  }, [
    productId,
    repairId,
  ]);

  if (isLoading) {
    return (
      <SecondLayout>
        <div />
      </SecondLayout>
    );
  }

  if (
    errorMessage ||
    !product ||
    !repairDetail
  ) {
    return (
      <SecondLayout>
        <div>
          {errorMessage ||
            "수리 이력을 찾을 수 없습니다."}
        </div>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col">
        {/* Family 헤더 */}
        <div>
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

            {/* 가족 제품 목록으로 나가기 */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/family",
                  {
                    state: {
                      selectedMemberId:
                        familyMemberId,
                    },
                  },
                )
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
              flex-col gap-[10px]
              overflow-y-auto
              no-scrollbar
            "
          >
            <div className="px-[10px]">
              <ProductCard
                imageSrc={
                  product.imageUrl
                }
                name={
                  product.nickname
                }
                description={
                  product.productName
                }
                actionType="close"
                onClick={() =>
                  navigate(
                    `/family/${familyMemberId}/products/${productId}`,
                    {
                      state: {
                        familyMemberName,
                      },
                    },
                  )
                }
                onActionClick={() =>
                  navigate(
                    `/family/${familyMemberId}/products/${productId}/repairs`,
                    {
                      state: {
                        familyMemberName,
                      },
                    },
                  )
                }
              />
            </div>

            <div className="mt-[21px] h-[2px] w-full bg-gray-02" />

            <div className="min-h-0 px-[10px]">
              <RepairDetailContent
                isEditMode={false}
                title={
                  repairDetail.title
                }
                repairDate={repairDetail.date.replaceAll(
                  "-",
                  ".",
                )}
                content={
                  repairDetail.content
                }
                price={formatPrice(
                  repairDetail.cost,
                )}
                shopName={
                  repairDetail.serviceCenter
                }
                receiptImageUrl={
                  repairDetail.imageUrl
                }
              />

              {/*
                가족 제품의 수리 이력은
                조회 전용.

                기존 RepairDetailPage와 달리
                수정 / 삭제 버튼 없음.
              */}
            </div>
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}