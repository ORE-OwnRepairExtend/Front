import { useNavigate } from "react-router-dom";
import ProductCreateHeader from "../../components/product/ProductCreateHeader";
import ProductCreateContent from "../../components/product/ProductCreateContent";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-03">
      <section className="flex h-[calc(100vh-100px)] w-[1200px] flex-col overflow-hidden rounded-[50px] bg-white p-[30px]">
        <ProductCreateHeader onClose={() => navigate(-1)} />

        <div className="flex min-h-0 flex-1 rounded-b-[50px] bg-neutral-04 p-[30px]">
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <ProductCreateContent />
          </div>
        </div>
      </section>
    </main>
  );
}
