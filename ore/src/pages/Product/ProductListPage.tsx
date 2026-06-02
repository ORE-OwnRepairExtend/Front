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

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
            <AddButton title="제품 등록" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      </div>

      {/* 모달 */}
      <ProductRegisterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSubmit={async (file, sourceType) => {
          try {
            const accessToken = localStorage.getItem("accessToken");

            // 이미지 업로드
            const formData = new FormData();

            formData.append("image", file);
            formData.append("sourceType", sourceType);

            const uploadResponse = await api.post(
              "/product-sources",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            const sourceId = uploadResponse.data.sourceId;

            // OCR 결과 조회
            const resultResponse = await api.get(
              `/product-sources/${sourceId}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            // 제품 등록 페이지 이동
            navigate("/products/new", {
              state: resultResponse.data,
            });

            setIsModalOpen(false);
          } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다.");
          }
        }}
        onManualClick={() => {
          navigate("/products/new");
          setIsModalOpen(false);
        }}
      />
    </SecondLayout>
  );
}