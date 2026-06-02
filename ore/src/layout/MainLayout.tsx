import { type ReactNode, useEffect, useState } from "react";
import SideNav from "../components/nav/SideNav";
import ProfileCard from "../components/profile/ProfileCard";
import FavoriteCard from "../components/profile/FavoriteCard";
import { api } from "../api/api";
import type { ProductWithStatus } from "../types/product";
import { CATEGORY_LABEL_MAP } from "../constants/productCategories";
import type { ApiProductCategory } from "../types/category";

type MainLayoutProps = {
  children: ReactNode;
};

type UserProfileResponse = {
  userId: string;
  email: string;
  name: string;
  profileImage: string;
  createdAt: string;
};

type ProductListResponse = {
  productId: string;
  name: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  createdAt: string;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  const [favoriteItems, setFavoriteItems] = useState<ProductWithStatus[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get<UserProfileResponse>("/users/me");
        setProfile(response.data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };
    // todo: 에러 ui처리
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        const response = await api.get<ProductListResponse[]>("/products", {
          params: {
            isFavorite: true,
          },
        });

        const mappedItems: ProductWithStatus[] = response.data.map(
          (product) => ({
            productId: product.productId,
            productName: product.name,
            nickname: product.nickname,
            imageUrl: product.imageUrl,
            isFavorite: product.isFavorite,
            hasRepairHistory: product.hasRepairHistory,
            purchaseDate: product.purchaseDate,
            createdAt: product.createdAt,
            category: CATEGORY_LABEL_MAP[product.category],
            status: "valid" as const, // todo: 보증 정보 기준 계산
          }),
        );

        setFavoriteItems(mappedItems);
      } catch (error) {
        console.error("즐겨찾기 제품 목록 조회 실패:", error);
      }
    };

    fetchFavoriteProducts();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-03 px-[50px] overflow-hidden">
      <div className="w-full max-w-[1400px] h-[90vh] rounded-[30px] bg-white/30 p-[25px]">
        <div className="flex h-full w-full rounded-[30px] bg-white p-[25px] items-stretch gap-[25px]">
          <aside className="shrink-0 self-stretch">
            <div className="h-full">
              <SideNav />
            </div>
          </aside>

          <main className="flex-1 rounded-[50px] bg-neutral-04 p-[30px] overflow-y-auto">
            {children}
          </main>

          <aside className="shrink-0 self-stretch">
            <div className="h-full flex flex-col justify-center gap-[50px]">
              <ProfileCard
                name={profile?.name ?? "사용자"}
                imageUrl={profile?.profileImage}
              />

              <FavoriteCard
                items={favoriteItems}
                onItemClick={(item) => console.log(item)}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
