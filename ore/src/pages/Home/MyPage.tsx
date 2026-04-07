import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import ProfileBox from "../../components/profile/ProfileBox";
import SecondLayout from "../../layout/SecondLayout";
import { mockUserProfile } from "../../mocks/ueser";

export default function MyPage() {
  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="My" />

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-[43px]">
            <ProfileBox
              name={mockUserProfile.name}
              email={mockUserProfile.email}
              imageUrl={mockUserProfile.profileImage}
            />

            <MenuList
              items={[
                { label: "계정 정보", onClick: () => {} },
                { label: "이용 약관", onClick: () => {} },
                { label: "로그아웃", onClick: () => {} },
              ]}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
