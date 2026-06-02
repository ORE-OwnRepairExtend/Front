import { useLocation, useNavigate } from "react-router-dom";
import ProductCreateHeader from "../../components/product/ProductCreateHeader";
import ProductCreateContent from "../../components/product/ProductCreateContent";
import type { ApiProductCategory } from "../../types/category";

type ExtractedProductData = {
  sourceId: string;
  imageUrl: string;
  ocrText: string;
  modelNumber: string;
  sourceType: "RECEIPT" | "SMS" | "STICKER" | "MANUAL";
  createdAt: string;
};

type EditProductData = {
  productId: string;
  productName: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string | null;
  modelNumber: string | null;
  purchaseDate: string | null;
  warrantyMonths: number | null;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  createdAt: string;
  manualContent?: string | null;
};

type EditProductLocationState = {
  mode: "edit";
  productId: string;
  productData: EditProductData;
};

type ProductCreateLocationState =
  | EditProductLocationState
  | ExtractedProductData
  | null
  | undefined;

const isEditProductState = (
  state: ProductCreateLocationState,
): state is EditProductLocationState => {
  return state !== null && state !== undefined && "mode" in state && state.mode === "edit";
};

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ProductCreateLocationState;

  const isEditMode = isEditProductState(state);

  const extractedData: ExtractedProductData | null = isEditMode
    ? null
    : state ?? null;

  const editProductId = isEditMode ? state.productId : null;
  const editProductData = isEditMode ? state.productData : null;

  return (
    <main className="flex h-screen items-center justify-center bg-neutral-03">
      <section className="flex h-[calc(100vh-100px)] w-[1200px] flex-col overflow-hidden rounded-[50px] bg-white p-[30px]">
        <ProductCreateHeader onClose={() => navigate(-1)} />

        <div className="flex min-h-0 flex-1 rounded-b-[50px] bg-neutral-04 p-[30px]">
          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <ProductCreateContent
              extractedData={extractedData}
              isEditMode={isEditMode}
              editProductId={editProductId}
              editProductData={editProductData}
            />
          </div>
        </div>
      </section>
    </main>
  );
}