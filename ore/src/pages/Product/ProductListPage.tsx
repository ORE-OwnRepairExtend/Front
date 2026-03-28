import { useState, useRef } from "react";
import SecondLayout from "../../layout/SecondLayout";
import SearchBar from "../../components/header/SearchBar";
import AddButton from "../../components/common/AddButton";
import ProductCard from "../../components/common/ProductCard";

import cameraImg from "../../assets/camera.png";
import bellIcon from "../../assets/bell.svg";
import starIcon from "../../assets/star.svg";
import phoneIcon from "../../assets/phone.svg";

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);

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

  const categories = [
    { label: "All" },
    { label: "즐겨찾기", icon: starIcon },
    { label: "모바일 기기", icon: phoneIcon },
    { label: "주방 가전", icon: phoneIcon },
    { label: "생활 가전", icon: phoneIcon },
    { label: "모바일 기기", icon: phoneIcon },
    { label: "모바일 기기", icon: phoneIcon },
    { label: "모바일 기기", icon: phoneIcon },
  ];

  return (
    <SecondLayout>
      <div className="flex flex-col h-full gap-[20px]">
        
      {/* 상단 + divider 묶기 */}
      <div className="px-[33px]">

        {/* 상단 */}
        <div className="flex items-center justify-between">
          <h1 className="text-title-b-32 text-primary-02">Product</h1>

          <div className="flex items-center gap-[15px]">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={() => console.log("검색:", search)}
            />

            <div className="w-[60px] h-[60px] rounded-[20px] bg-[#C8ECCE] flex items-center justify-center">
              <img src={bellIcon} alt="알림" className="w-[45px] h-[45px]" />
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="w-[calc(100%+66px)] -ml-[33px] h-[2px] bg-gray-02 mt-[10px]" />
      </div>

        {/* 필터 */}
        <div className="flex items-center gap-[10px]">
          
          {/* All */}
          <button
            onClick={() => setSelected(0)}
            className={`
              flex items-center gap-[8px]
              px-[20px]
              h-[50px]
              rounded-[25px]
              border-[3px]
              box-border
              shrink-0
              text-[20px] font-medium
              whitespace-nowrap
              transition
              ${
                selected === 0
                  ? "bg-[#CDECEA] border-[#298882] text-primary-01"
                  : "bg-white border-transparent text-[#817979]"
              }
            `}
          >
            All
          </button>

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
              const isSelected = selected === realIdx;

              return (
                <button
                  key={realIdx}
                  onClick={() => setSelected(realIdx)}
                  className={`
                    flex items-center gap-[8px]
                    px-[20px]
                    h-[50px]
                    rounded-[25px]
                    border-[3px]
                    box-border
                    shrink-0
                    text-[20px] font-medium
                    whitespace-nowrap
                    transition
                    ${
                      isSelected
                        ? "bg-[#CDECEA] border-[#298882] text-primary-01"
                        : "bg-white border-transparent text-[#817979]"
                    }
                  `}
                >
                  {item.icon && (
                    <img src={item.icon} alt="" className="w-[30px] h-[30px]" />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 리스트 */}
        <div className="flex flex-col gap-[20px] flex-1 overflow-y-auto no-scrollbar">
          <ProductCard imageSrc={cameraImg} name="카메라" description="SONY 미러리스 카메라" />
          <ProductCard imageSrc={cameraImg} name="카메라" description="SONY 미러리스 카메라" />
          <ProductCard imageSrc={cameraImg} name="카메라" description="SONY 미러리스 카메라" />
          <ProductCard imageSrc={cameraImg} name="카메라" description="SONY 미러리스 카메라" />
          <ProductCard imageSrc={cameraImg} name="카메라" description="SONY 미러리스 카메라" />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end pr-[30px]">
          <div className="w-[174px]">
            <AddButton title="제품 등록" onClick={() => console.log("제품 등록")} />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}