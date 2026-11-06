import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFamilyErrorMessage,
  getFamilyMembers,
  getFamilyProducts,
  type FamilyMember,
  type FamilyProduct,
} from "../../api/family";
import ProfileImage from "../profile/ProfileImage";

import forwardIcon from "../../assets/icons/forword.svg";
import profileIcon from "../../assets/icons/profile.svg";

export default function FamilyDashboard() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] =
    useState<FamilyMember | null>(null);
  const [products, setProducts] = useState<FamilyProduct[]>([]);

  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [memberError, setMemberError] = useState("");
  const [productError, setProductError] = useState("");

  const [memberRetry, setMemberRetry] = useState(0);
  const [productRetry, setProductRetry] = useState(0);

  // 본인을 제외한 가족 목록 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      try {
        setIsLoadingMembers(true);
        setMemberError("");

        const data = await getFamilyMembers(controller.signal);

        if (controller.signal.aborted) return;

        setMembers(data.filter((member) => !member.isMe));
      } catch (error) {
        if (controller.signal.aborted) return;

        setMemberError(
          getFamilyErrorMessage(
            error,
            "가족 목록을 불러오지 못했습니다.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMembers(false);
        }
      }
    };

    void fetchMembers();

    return () => controller.abort();
  }, [memberRetry]);

  // 선택한 가족의 최근 등록 제품 3개 조회
  useEffect(() => {
    if (!selectedMember) return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductError("");
        setProducts([]);

        const data = await getFamilyProducts(
          selectedMember.userId,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setProducts(
          data
            .filter(
              (product) =>
                !product.owner.isMe &&
                product.owner.userId === selectedMember.userId,
            )
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 3),
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        setProductError(
          getFamilyErrorMessage(
            error,
            "가족 제품을 불러오지 못했습니다.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingProducts(false);
        }
      }
    };

    void fetchProducts();

    return () => controller.abort();
  }, [selectedMember, productRetry]);

  const selectMember = (member: FamilyMember) => {
    setProducts([]);
    setProductError("");
    setIsLoadingProducts(true);
    setSelectedMember(member);
  };

  const openFamily = () => {
    navigate("/family", {
      state: {
        selectedMemberId: selectedMember?.userId ?? "ALL",
      },
    });
  };

  return (
    <section className="min-w-0 rounded-[30px] bg-white p-[20px]">
      <div className="mb-[14px] flex items-center justify-between gap-[10px]">
        <h2 className="text-title-main text-primary-01">
          Family
        </h2>

        <div className="flex items-center gap-[10px]">
          {selectedMember && (
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="cursor-pointer text-body-r-12 text-gray-01"
            >
              가족 목록
            </button>
          )}

          <button
            type="button"
            onClick={openFamily}
            aria-label={
              selectedMember
                ? "선택한 가족 제품 전체 보기"
                : "가족 전체 보기"
            }
            className="cursor-pointer p-[4px]"
          >
            <img
              src={forwardIcon}
              alt=""
              className="h-[20px] w-[20px]"
            />
          </button>
        </div>
      </div>

      {isLoadingMembers ? (
        <p className="py-[30px] text-center text-body-r-12 text-gray-01">
          가족 목록을 불러오는 중입니다.
        </p>
      ) : memberError ? (
        <div className="py-[20px] text-center">
          <p
            role="alert"
            className="text-body-r-12 text-gray-01"
          >
            {memberError}
          </p>

          <button
            type="button"
            onClick={() => setMemberRetry((prev) => prev + 1)}
            className="mt-[10px] cursor-pointer text-body-r-12 text-primary-01"
          >
            다시 시도
          </button>
        </div>
      ) : members.length === 0 ? (
        <p className="py-[30px] text-center text-body-r-12 text-gray-01">
          등록된 가족이 없습니다.
        </p>
      ) : selectedMember ? (
        <div className="flex min-w-0 items-stretch gap-[10px]">
          {/* 선택한 가족 */}
          <FamilyProfileCard
            member={selectedMember}
            selected
            onClick={() => setSelectedMember(null)}
          />

          {/* 선택한 가족의 최근 제품 */}
          <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
            {isLoadingProducts ? (
              <p className="flex min-h-[200px] items-center justify-center text-center text-body-r-12 text-gray-01">
                제품을 불러오는 중입니다.
              </p>
            ) : productError ? (
              <div className="my-auto text-center">
                <p
                  role="alert"
                  className="text-body-r-12 text-gray-01"
                >
                  {productError}
                </p>

                <button
                  type="button"
                  onClick={() => setProductRetry((prev) => prev + 1)}
                  className="mt-[10px] cursor-pointer text-body-r-12 text-primary-01"
                >
                  다시 시도
                </button>
              </div>
            ) : products.length === 0 ? (
              <p className="flex min-h-[200px] items-center justify-center text-center text-body-r-12 text-gray-01">
                등록된 제품이 없습니다.
              </p>
            ) : (
              products.map((product) => (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/family/${selectedMember.userId}/products/${product.productId}`,
                      {
                        state: {
                          familyMemberName:
                            selectedMember.nickname ||
                            selectedMember.name,
                        },
                      },
                    )
                  }
                  className="
                    flex min-h-[58px] min-w-0
                    cursor-pointer items-center justify-between
                    gap-[10px] rounded-[16px] bg-neutral-04
                    px-[20px] py-[10px] text-left
                  "
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-sb-16 text-primary-01">
                      {product.nickname || product.name}
                    </span>

                    <span className="block truncate text-[10px] leading-[14px] text-gray-01">
                      {product.name}
                    </span>
                  </span>

                  <img
                    src={forwardIcon}
                    alt=""
                    className="h-[18px] w-[18px] shrink-0"
                  />
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        /* 가족 목록 */
        <div className="flex items-stretch gap-[10px] overflow-x-auto pb-[2px] no-scrollbar">
          {members.map((member) => (
            <FamilyProfileCard
              key={member.userId}
              member={member}
              onClick={() => selectMember(member)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type FamilyProfileCardProps = {
  member: FamilyMember;
  selected?: boolean;
  onClick: () => void;
};

function FamilyProfileCard({
  member,
  selected = false,
  onClick,
}: FamilyProfileCardProps) {
  const nickname = member.nickname || member.name;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${nickname} 최근 제품 보기`}
      aria-pressed={selected}
      className={`
        flex min-h-[200px] w-[125px]
        shrink-0 cursor-pointer
        flex-col items-center
        rounded-[20px] border border-primary-01
        px-[10px] py-[16px]
        ${
          selected
            ? "bg-neutral-01"
            : "bg-white hover:bg-neutral-01"
        }
      `}
    >
      {/* 가족 닉네임 */}
      <span className="mb-[14px] w-full truncate text-center text-body-sb-16 text-primary-01">
        {nickname}
      </span>

      {/* 프로필 이미지 */}
      <ProfileImage
        imageUrl={member.profileImageUrl || profileIcon}
        alt={`${nickname} 프로필`}
        size={70}
      />

      {/* 이름 */}
      <span className="mt-[12px] w-full truncate text-center text-[10px] leading-[14px] text-gray-01">
        {member.name}
      </span>

      <span className="my-[3px] h-px w-full bg-gray-01" />

      {/* 이메일 */}
      <span
        className="w-full truncate text-center text-[10px] leading-[14px] text-gray-01"
        title={member.email}
      >
        {member.email}
      </span>
    </button>
  );
}