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
import ProductCard from "../../components/common/ProductCard";
import AddButton from "../../components/common/AddButton";
import RepairHistoryCard from "../../components/repair/RepairHistoryCard";

import { api } from "../../api/api";
import { formatPrice } from "../../utils/formatPrice";

import closeIcon from "../../assets/icons/close.svg";

type FamilyLocationState = {
  familyMemberName?: string;
};

type RepairHistory = {
  repairId: string;
  date: string;
  title: string;
  cost: number;
  createdAt: string;
};

type ProductDetail = {
  productId: string;
  productName: string;
  nickname: string;
  imageUrl: string | null;
};

export default function FamilyRepairHistoryPage() {
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
    useState<ProductDetail | null>(
      null,
    );

  const [
    repairHistoryList,
    setRepairHistoryList,
  ] =
    useState<RepairHistory[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchData =
      async () => {
        try {
          setIsLoading(true);

          const [
            productResponse,
            repairResponse,
          ] =
            await Promise.all([
              api.get<ProductDetail>(
                `/products/${productId}`,
              ),

              api.get<
                RepairHistory[]
              >(
                `/products/${productId}/repairs`,
              ),
            ]);

          setProduct(
            productResponse.data,
          );

          setRepairHistoryList(
            repairResponse.data,
          );
        } catch (error) {
          console.error(
            "가족 수리 이력 조회 실패:",
            error,
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

  if (!product) {
    return (
      <SecondLayout>
        <div>
          제품을 찾을 수 없습니다.
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

            {/* 가족 페이지로 완전히 나가기 */}
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
            mt-[24px]
            flex min-h-0
            flex-1 flex-col
            px-[10px]
          "
        >
          {/* 제품 */}
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
                `/family/${familyMemberId}/products/${productId}`,
                {
                  state: {
                    familyMemberName,
                  },
                },
              )
            }
          />

          <div
            className="
              mt-[11px]
              flex min-h-0
              flex-1 flex-col
              gap-[20px]
              px-[10px]
            "
          >
            <div
              className="
                no-scrollbar
                flex flex-1
                flex-col gap-[10px]
                overflow-y-auto
              "
            >
              {repairHistoryList.length ===
              0 ? (
                <div className="text-center text-gray-02">
                  등록된 수리 이력이
                  없습니다.
                </div>
              ) : (
                repairHistoryList.map(
                  (item) => (
                    <RepairHistoryCard
                      key={
                        item.repairId
                      }
                      repairName={
                        item.title
                      }
                      repairDate={item.date.replaceAll(
                        "-",
                        ".",
                      )}
                      price={formatPrice(
                        item.cost,
                      )}
                      onClick={() =>
                        navigate(
                          `/family/${familyMemberId}/products/${productId}/repairs/${item.repairId}`,
                          {
                            state: {
                              familyMemberName,
                            },
                          },
                        )
                      }
                    />
                  ),
                )
              )}
            </div>

            {/* 가족 제품도 수리 등록 가능 */}
            <AddButton
              title="수리 이력 등록하기"
              onClick={() =>
                navigate(
                  `/products/${productId}/repairs/new`,
                  {
                    state: {
                      familyMemberId,
                      familyMemberName,
                      productId:
                        product.productId,
                    },
                  },
                )
              }
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}