import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import CategoryButton from "../../components/category/CategoryButton";
import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";
import ProductRegisterModal from "../../components/common/ProductRegisterModal";
import { productCategories as categories } from "../../constants/productCategories";

import cameraImg from "../../assets/camera.png";

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const products = [
    {
      id: 1,
      imageSrc: cameraImg,
      name: "카메라",
      description: "SONY 미러리스 카메라",
    },
    {
      id: 2,
      imageSrc: cameraImg,
      name: "카메라",
      description: "SONY 미러리스 카메라",
    },
    {
      id: 3,
      imageSrc: cameraImg,
      name: "카메라",
      description: "SONY 미러리스 카메라",
    },
    {
      id: 4,
      imageSrc: cameraImg,
      name: "카메라",
      description: "SONY 미러리스 카메라",
    },
    {
      id: 5,
      imageSrc: cameraImg,
      name: "카메라",
      description: "SONY 미러리스 카메라",
    },
  ];

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
          {products.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <ProductCard
                imageSrc={item.imageSrc}
                name={item.name}
                description={item.description}
              />
            </div>
          ))}
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
            // 이미지 업로드
            const formData = new FormData();

            formData.append("image", file);
            formData.append("sourceType", sourceType);

            const uploadResponse = await api.post(
              "/product-sources",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );

            const sourceId = uploadResponse.data.sourceId;

            // OCR 결과 조회
            const resultResponse = await api.get(
              `/product-sources/${sourceId}`,
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
