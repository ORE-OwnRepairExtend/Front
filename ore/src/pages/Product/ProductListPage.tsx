import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import CategoryButton from "../../components/category/CategoryButton";
import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import ProductRegisterModal from "../../components/common/ProductRegisterModal";
import { productCategories as categories } from "../../constants/productCategories";
import OcrConfirmModal, {
  type OcrConfirmForm,
} from "../../components/product/OcrConfirmModal";
import axios from "axios";

type Product = {
  productId: string;
  name: string;
  nickname: string;
  category: string;
  imageUrl: string;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  createdAt: string;
};

type SourceType = "RECEIPT" | "SMS" | "STICKER" | "MANUAL";

type ProductSourceResponse = {
  sourceId: string;
  imageUrl: string;
  ocrText: string | null;
  brandName: string | null;
  productName: string | null;
  modelNumber: string | null;
  sourceType: SourceType;
  createdAt: string;
};

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ocrResult, setOcrResult] = useState<ProductSourceResponse | null>(
    null,
  );

  const [ocrForm, setOcrForm] = useState<OcrConfirmForm>({
    brandName: "",
    productName: "",
    modelNumber: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [registerModalKey, setRegisterModalKey] = useState(0);

  const navigate = useNavigate();

  const [isUploadingSource, setIsUploadingSource] = useState(false);
  const [isConfirmingOcr, setIsConfirmingOcr] = useState(false);

  // 드래그 스크롤
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.2;

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      const response = await api.get<Product[]>("/products", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("제품 목록 조회 실패:", error);
      alert("제품 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const keyword = search.trim().toLowerCase();

      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.nickname.toLowerCase().includes(keyword);

      const selectedCategory = categories[selected];

      const matchesCategory =
        selectedCategory.value === "ALL"
          ? true
          : selectedCategory.value === "FAVORITE"
            ? product.isFavorite
            : product.category === selectedCategory.value;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selected]);

  return (
    <SecondLayout>
      <div className="flex h-full flex-col gap-[20px]">
        {/* Header */}
        <Header
          title="Product"
          showSearch
          searchValue={search}
          onSearchChange={setSearch}
          onSearchSubmit={() => console.log("검색:", search)}
        />

        {/* 카테고리 필터 */}
        <div className="flex items-center gap-[10px]">
          {/* All 버튼 */}
          <div className="h-[50px] flex items-center">
            <CategoryButton
              label="All"
              isSelected={selected === 0}
              onClick={() => setSelected(0)}
            />
          </div>

          {/* 스크롤 영역 */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="
              flex gap-[10px]
              overflow-x-auto
              no-scrollbar
              cursor-grab active:cursor-grabbing
            "
          >
            {categories.slice(1).map((item, idx) => {
              const realIdx = idx + 1;

              return (
                <div key={realIdx} className="h-[50px] flex items-center">
                  <CategoryButton
                    label={item.label}
                    icon={item.icon}
                    isSelected={selected === realIdx}
                    onClick={() => setSelected(realIdx)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 리스트 */}
        <div className="flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar px-[20px]">
          {isLoading ? (
            <div className="text-center text-neutral-02">
              제품 목록을 불러오는 중입니다.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-neutral-02">
              등록된 제품이 없습니다.
            </div>
          ) : (
            filteredProducts.map((item) => (
              <div
                key={item.productId}
                className="cursor-pointer"
                onClick={() => navigate(`/products/${item.productId}`)}
              >
                <ProductCard
                  imageSrc={item.imageUrl}
                  name={item.nickname}
                  description={item.name}
                />
              </div>
            ))
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end pr-[30px]">
          <div className="w-[174px]">
            <AddButton
              title="제품 등록"
              onClick={() => {
                setRegisterModalKey((prev) => prev + 1);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* 모달 */}
      <ProductRegisterModal
        key={registerModalKey}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSubmit={async (file, sourceType) => {
          try {
            setIsUploadingSource(true);

            const accessToken = localStorage.getItem("accessToken");

            const formData = new FormData();
            formData.append("image", file);
            formData.append("sourceType", sourceType);

            const uploadResponse = await api.post<ProductSourceResponse>(
              "/product-sources",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            const uploadedData = uploadResponse.data;

            setOcrResult(uploadedData);
            setOcrForm({
              brandName: uploadedData.brandName ?? "",
              productName: uploadedData.productName ?? "",
              modelNumber: uploadedData.modelNumber ?? "",
            });

            setIsModalOpen(false);
          } catch (error: unknown) {
            console.error("이미지 업로드 실패:", error);

            if (axios.isAxiosError(error)) {
              alert(
                error.response?.data?.message ??
                  "이미지 업로드에 실패했습니다.",
              );
            } else {
              alert("이미지 업로드에 실패했습니다.");
            }
          } finally {
            setIsUploadingSource(false);
          }
        }}
      />
      <OcrConfirmModal
        open={!!ocrResult}
        form={ocrForm}
        onChange={(key, value) => {
          setOcrForm((prev) => ({
            ...prev,
            [key]: value,
          }));
        }}
        onClose={() => {
          setOcrResult(null);
        }}
        onSubmit={async () => {
          if (!ocrResult) return;

          try {
            setIsConfirmingOcr(true);

            const accessToken = localStorage.getItem("accessToken");

            const response = await api.patch<ProductSourceResponse>(
              `/product-sources/${ocrResult.sourceId}`,
              {
                brandName: ocrForm.brandName,
                productName: ocrForm.productName,
                modelNumber: ocrForm.modelNumber,
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            navigate("/products/new", {
              state: {
                sourceId: response.data.sourceId,
                productName: response.data.productName,
              },
            });

            setOcrResult(null);
          } catch (error: unknown) {
            console.error("OCR 분석 제품 정보 수정 실패:", error);

            if (axios.isAxiosError(error)) {
              alert(
                error.response?.data?.message ??
                  "제품 정보 확인에 실패했습니다.",
              );
            } else {
              alert("제품 정보 확인에 실패했습니다.");
            }
          } finally {
            setIsConfirmingOcr(false);
          }
        }}
      />

      {isUploadingSource && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-01/80">
          <div className="flex h-[180px] w-[320px] flex-col items-center justify-center gap-[20px] rounded-[20px] bg-secondary-01">
            <div className="h-[40px] w-[40px] animate-spin rounded-full border-4 border-primary-01 border-t-transparent" />
            <p className="text-center text-title-sb-20 text-primary-01">
              이미지를 분석하고 있어요
            </p>
            <p className="text-center text-body-m-16 text-gray-01">
              제품 정보를 추출하는 중입니다.
            </p>
          </div>
        </div>
      )}
      {isConfirmingOcr && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-01/80">
          <div className="flex h-[180px] w-[320px] flex-col items-center justify-center gap-[20px] rounded-[20px] bg-secondary-01">
            <div className="h-[40px] w-[40px] animate-spin rounded-full border-4 border-primary-01 border-t-transparent" />
            <p className="text-center text-title-sb-20 text-primary-01">
              제품 정보를 저장하고 있어요
            </p>
            <p className="text-center text-body-m-16 text-gray-01">
              매뉴얼 검색을 준비하는 중입니다.
            </p>
          </div>
        </div>
      )}
    </SecondLayout>
  );
}
