import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductCard from "../../components/common/ProductCard";
import {
  getFamilyErrorMessage,
  getFamilyMembers,
  getFamilyProducts,
  type FamilyMember,
  type FamilyProduct,
} from "../../api/family";

type FamilyPageLocationState = {
  selectedMemberId?: string;
};

export default function FamilyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    location.state as FamilyPageLocationState | null;

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [products, setProducts] = useState<FamilyProduct[]>([]);

  const [selectedMemberId, setSelectedMemberId] = useState(
    locationState?.selectedMemberId ?? "ALL",
  );

  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [membersLoaded, setMembersLoaded] = useState(false);

  const [memberErrorMessage, setMemberErrorMessage] = useState("");
  const [productErrorMessage, setProductErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const selectMember = (memberId: string) => {
    if (memberId === selectedMemberId) return;

    setProducts([]);
    setProductErrorMessage("");
    setIsProductsLoading(true);
    setSelectedMemberId(memberId);
  };

  // 같은 화면에서 다른 구성원 선택 상태로 이동한 경우 반영
  useEffect(() => {
    const memberId = locationState?.selectedMemberId ?? "ALL";

    setSelectedMemberId(memberId);
    setProducts([]);
    setIsProductsLoading(true);
  }, [location.key]);

  // 가족 구성원 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      try {
        setIsMembersLoading(true);
        setMembersLoaded(false);
        setMemberErrorMessage("");

        const members = await getFamilyMembers(controller.signal);

        if (controller.signal.aborted) return;

        const otherMembers = members.filter((member) => !member.isMe);

        setFamilyMembers(otherMembers);

        setSelectedMemberId((currentId) =>
          currentId === "ALL" ||
          otherMembers.some((member) => member.userId === currentId)
            ? currentId
            : "ALL",
        );

        setMembersLoaded(true);
      } catch (error) {
        if (controller.signal.aborted) return;

        setFamilyMembers([]);
        setMemberErrorMessage(
          getFamilyErrorMessage(
            error,
            "가족 구성원 목록을 불러오지 못했습니다.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsMembersLoading(false);
        }
      }
    };

    void fetchMembers();

    return () => controller.abort();
  }, [reloadKey]);

  // 선택한 구성원의 제품 조회
  useEffect(() => {
    if (!membersLoaded) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        setProductErrorMessage("");
        setProducts([]);

        const response = await getFamilyProducts(
          selectedMemberId === "ALL" ? undefined : selectedMemberId,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        const familyProducts = response.filter(
          (product) => product.owner.isMe === false,
        );

        familyProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

        setProducts(familyProducts);
      } catch (error) {
        if (controller.signal.aborted) return;

        setProductErrorMessage(
          getFamilyErrorMessage(
            error,
            "가족 제품을 불러오지 못했습니다.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsProductsLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => controller.abort();
  }, [selectedMemberId, membersLoaded, reloadKey]);

  const handleProductClick = (product: FamilyProduct) => {
    const owner = product.owner;

    navigate(
      `/family/${owner.userId}/products/${product.productId}`,
      {
        state: {
          familyMemberName: owner.nickname || owner.name,
        },
      },
    );
  };

  const errorMessage = memberErrorMessage || productErrorMessage;

  return (
    <SecondLayout>
      <div className="flex h-full min-h-0 flex-col gap-[20px]">
        <Header title="Family" />

        {/* 가족 구성원 필터 */}
        <div className="flex shrink-0 items-center gap-[10px] overflow-x-auto no-scrollbar">
          <FamilyFilterButton
            label="ALL"
            selected={selectedMemberId === "ALL"}
            onClick={() => selectMember("ALL")}
          />

          {familyMembers.map((member) => (
            <FamilyFilterButton
              key={member.userId}
              label={member.nickname || member.name}
              selected={selectedMemberId === member.userId}
              onClick={() => selectMember(member.userId)}
            />
          ))}
        </div>

        {/* 제품 리스트 */}
        <div
          className="
            flex min-h-0 flex-1 flex-col gap-[20px]
            overflow-y-auto px-[20px] no-scrollbar
          "
        >
          {errorMessage ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-[12px]">
              <p
                role="alert"
                className="text-center text-body-m-14 text-gray-01"
              >
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => setReloadKey((prev) => prev + 1)}
                className="
                  cursor-pointer rounded-[10px]
                  bg-primary-01 px-[20px] py-[8px]
                  text-body-m-14 text-white
                "
              >
                다시 시도
              </button>
            </div>
          ) : isMembersLoading || isProductsLoading ? (
            <div className="flex flex-1 items-center justify-center text-body-m-16 text-gray-01">
              가족 제품을 불러오는 중입니다.
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-body-m-16 text-gray-01">
              {familyMembers.length === 0
                ? "등록된 가족이 없습니다."
                : "등록된 제품이 없습니다."}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.productId}
                className="flex flex-col gap-[6px]"
              >
                {selectedMemberId === "ALL" && (
                  <p className="px-[10px] text-body-sb-12 text-primary-01">
                    {product.owner.nickname || product.owner.name}
                  </p>
                )}

                <ProductCard
                  imageSrc={product.imageUrl}
                  name={product.nickname || product.name}
                  description={product.name}
                  imageSize={100}
                  onClick={() => handleProductClick(product)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </SecondLayout>
  );
}

type FamilyFilterButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function FamilyFilterButton({
  label,
  selected,
  onClick,
}: FamilyFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        flex h-[36px] min-w-[60px]
        shrink-0 items-center justify-center
        rounded-[18px] border-[2px] px-[18px]
        text-body-m-12 cursor-pointer transition-all
        ${
          selected
            ? "border-primary-01 bg-secondary-01 text-primary-01"
            : "border-transparent bg-white text-gray-01"
        }
      `}
    >
      {label}
    </button>
  );
}