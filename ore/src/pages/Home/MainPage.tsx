import Header from "../../components/header/Header";
import MainLayout from "../../layout/MainLayout";

export default function MainPage() {
  return (
    <div>
      {/* <h1 className="text-xl font-bold">메인페이지</h1> */}
      <MainLayout>
        <Header title="메인페이지"></Header>
      </MainLayout>
    </div>
  );
}
