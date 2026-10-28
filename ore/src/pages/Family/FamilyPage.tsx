import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductCard from "../../components/common/ProductCard";
import AddButton from "../../components/common/AddButton";

type FamilyProduct = {
  productId: string;
  name: string;
  nickname: string;
  imageUrl?: string | null;
  createdAt: string;
};

type FamilyMember = {
  memberId: string;
  nickname: string;
  products: FamilyProduct[];
};

const mockFamilyMembers: FamilyMember[] = [
  {
    memberId: "member-1",
    nickname: "엄마",
    products: [
      {
        productId: "product-1",
        name: "SONY-RX1R III 컴팩트 카메라",
        nickname: "카메라",
        imageUrl: null,
        createdAt: "2026-10-25T10:00:00",
      },
      {
        productId: "product-2",
        name: "SONY-RX1R III 컴팩트 카메라",
        nickname: "카메라",
        imageUrl: null,
        createdAt: "2026-10-20T10:00:00",
      },
    ],
  },
  {
    memberId: "member-2",
    nickname: "아빠",
    products: [
      {
        productId: "product-3",
        name: "SONY-RX1R III 컴팩트 카메라",
        nickname: "카메라",
        imageUrl: null,
        createdAt: "2026-10-23T10:00:00",
      },
    ],
  },
  {
    memberId: "member-3",
    nickname: "동생",
    products: [
      {
        productId: "product-4",
        name: "SONY-RX1R III 컴팩트 카메라",
        nickname: "카메라",
        imageUrl: null,
        createdAt: "2026-10-18T10:00:00",
      },
    ],
  },
];

export default function FamilyPage() {
  const navigate = useNavigate();

  const [familyMembers] =
    useState<FamilyMember[]>(mockFamilyMembers);

  const [selectedMemberId, setSelectedMemberId] =
    useState<string>("ALL");

  const selectedMember =
    familyMembers.find(
      (member) =>
        member.memberId === selectedMemberId,
    ) ?? null;

  /*
   * ALL:
   * 모든 가족 구성원의 제품 표시
   *
   * 특정 구성원:
   * 해당 구성원의 제품만 표시
   *
   * 등록일 기준 최신 등록 제품부터 정렬
   */
  const visibleProducts = useMemo(() => {
    const products =
      selectedMemberId === "ALL"
        ? familyMembers.flatMap(
            (member) => member.products,
          )
        : selectedMember?.products ?? [];

    return [...products].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }, [
    familyMembers,
    selectedMember,
    selectedMemberId,
  ]);

  /*
   * 특정 가족 구성원 상태에서만
   * 수리 이력 등록 가능
   */
  const handleRepairRegister = () => {
    if (!selectedMember) {
      return;
    }

    navigate("/repairs/new", {
      state: {
        familyMemberId:
          selectedMember.memberId,
        familyMemberName:
          selectedMember.nickname,

        // 해당 가족 구성원의 제품만
        // RepairCreatePage에서 선택할 수 있도록 전달
        allowedProductIds:
          selectedMember.products.map(
            (product) =>
              product.productId,
          ),
      },
    });
  };

  return (
    <SecondLayout>
      <div
        className="
          flex h-full min-h-0
          flex-col
          gap-[20px]
        "
      >
        {/* 헤더 */}
        <Header title="Family" />

        {/* 가족 구성원 필터 */}
        <div
          className="
            flex items-center
            gap-[10px]
          "
        >
          <FamilyFilterButton
            label="ALL"
            selected={
              selectedMemberId === "ALL"
            }
            onClick={() =>
              setSelectedMemberId("ALL")
            }
          />

          {familyMembers.map(
            (member) => (
              <FamilyFilterButton
                key={member.memberId}
                label={member.nickname}
                selected={
                  selectedMemberId ===
                  member.memberId
                }
                onClick={() =>
                  setSelectedMemberId(
                    member.memberId,
                  )
                }
              />
            ),
          )}
        </div>

        {/* 제품 리스트 */}
        <div
          className="
            flex min-h-0 flex-1
            flex-col gap-[20px]
            overflow-y-auto
            px-[20px]
            no-scrollbar
          "
        >
          {visibleProducts.length === 0 ? (
            <div
              className="
                flex flex-1
                items-center
                justify-center
                text-body-m-16
                text-gray-01
              "
            >
              등록된 제품이 없습니다.
            </div>
          ) : (
            visibleProducts.map(
              (product) => (
                <ProductCard
                  key={product.productId}
                  imageSrc={
                    product.imageUrl
                  }
                  name={
                    product.nickname
                  }
                  description={
                    product.name
                  }
                  imageSize={100}
                  onClick={() =>
                    navigate(
                      `/products/${product.productId}`,
                    )
                  }
                />
              ),
            )
          )}
        </div>

        {/* 특정 가족 선택 시에만 표시 */}
        {selectedMember && (
          <div className="px-[20px]">
            <AddButton
              title="수리 이력 등록하기"
              onClick={
                handleRepairRegister
              }
            />
          </div>
        )}
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
      className={`
        flex h-[36px]
        min-w-[60px]
        items-center
        justify-center
        rounded-[18px]
        px-[18px]
        text-body-m-12
        cursor-pointer
        transition-all
        duration-200

        ${
          selected
            ? `
              border-[2px]
              border-primary-01
              bg-secondary-01
              text-primary-01
            `
            : `
              border-[2px]
              border-transparent
              bg-white
              text-gray-01
            `
        }
      `}
    >
      {label}
    </button>
  );
}