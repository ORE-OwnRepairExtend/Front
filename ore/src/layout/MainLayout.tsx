import type { ReactNode } from "react";
import SideNav from "../components/nav/SideNav";
import ProfileCard from "../components/profile/ProfileCard";
import FavoriteCard from "../components/profile/FavoriteCard";
import { mockUserProfile } from "../mocks/ueser";
import { mockProductListResponse } from "../mocks/products";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const favoriteItems = mockProductListResponse.filter(
    (item) => item.isFavorite,
  );

  return (
    <div className="h-screen flex items-center justify-center bg-neutral-03 px-[50px] overflow-hidden">
      {/* 바깥 반투명 박스 */}
      <div className="w-full max-w-[1400px] h-[90vh] rounded-[30px] bg-white/30 p-[25px]">
        {/* 안쪽 흰 박스 */}
        <div className="flex h-full w-full rounded-[30px] bg-white p-[25px] items-stretch gap-[25px]">
          {/* 좌측 SideNav */}
          <aside className="shrink-0 self-stretch">
            <div className="h-full">
              <SideNav />
            </div>
          </aside>

          {/* 가운데 메인 콘텐츠 */}
          <main className="flex-1 rounded-[50px] bg-neutral-04 p-[30px] overflow-y-auto">
            {children}
          </main>

          {/* 우측 콘텐츠 */}
          <aside className="shrink-0 self-stretch">
            <div className="h-full flex flex-col justify-center gap-[50px]">
              <ProfileCard
                name={mockUserProfile.name}
                imageUrl={mockUserProfile.profileImage}
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
