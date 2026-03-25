import Header from "../../components/header/Header";
import SecondLayout from "../../layout/SecondLayout";

export default function MainPage() {
  return (
    <div>
      {/* <h1 className="text-xl font-bold">메인페이지</h1> */}
      <SecondLayout>
        <Header
          title="Own Repair Extend"
          subtitle="더 오래, 더 제대로"
          isMain
          showSearch
          onSearchSubmit={() => console.log("검색")}
          showNotification
          hasUnreadNotification
          onNotificationClick={() => console.log("알림 클릭")}
        />
        <h1 className="text-xl font-bold">메인페이지</h1>
      </SecondLayout>
    </div>
  );
}
