import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Header from "../../components/header/Header";
import ProductInfoCard from "../../components/common/ProductInfoCard";
import { getProductStatus } from "../../utils/productStatus";

const products = [
  { id: 1, name: "카메라", img: "/photos/camera.png", desc: "SONY-RX1R III" },
  { id: 2, name: "내폰", img: "/photos/phone.png", desc: "iPhone 15" },
  { id: 3, name: "우리집 냉장고", img: "/photos/refrigerator.png", desc: "LG DIOS" },
  { id: 4, name: "에어팟", img: "/photos/airpods.png", desc: "AirPods Pro" },
  { id: 5, name: "에어팟", img: "/photos/airpods.png", desc: "AirPods Pro" },
  { id: 6, name: "에어팟", img: "/photos/airpods.png", desc: "AirPods Pro" },
];

const warrantyList = [
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "내폰 - APPLE", remainingDays: 20 },
  { name: "우리집 냉장고 - LG", remainingDays: 40 },
  { name: "에어팟 - APPLE", remainingDays: -3 },
  { name: "에어팟 - APPLE", remainingDays: -3 },
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "카메라 - SONY", remainingDays: 5 },
  { name: "카메라 - SONY", remainingDays: 5 }
];

export default function MainPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [isDown, setIsDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDown(false);

  const handleMouseUp = () => {
    setIsDown(false);
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;

    setIsDragging(true);
    e.preventDefault();

    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;

    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col">

        {/* Header */}
        <Header
          title="Own Repair Extend"
          subtitle="더 오래, 더 제대로"
          isMain
        />

        {/* Product 영역 */}
        <div className="bg-neutral-01 rounded-[30px]">

          <div className="flex justify-between items-center px-[20px] pt-[20px] mb-[15px]">
            <h2 className="text-title-main text-primary-01">Product</h2>
            <span
              className="text-gray-02 text-body-r-15 mr-[15px] cursor-pointer"
              onClick={() => navigate("/products")}
            >
              MORE &gt;
            </span>
          </div>

          <div className="px-[20px] pb-[20px]">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="
                flex gap-[15px] items-end
                overflow-x-auto
                cursor-grab active:cursor-grabbing
                select-none
                no-scrollbar
              "
            >

              {/* + 버튼 */}
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  if (isDragging) return;
                  console.log("제품 추가 클릭");
                }}
                className="
                  flex-shrink-0
                  w-[80px] h-[135px]
                  rounded-[20px]
                  border-[3px] border-gray-02
                  flex items-center justify-center
                  cursor-pointer
                  hover:bg-gray-100 transition
                "
              >
                <span className="text-[32px] text-gray-02 font-light">+</span>
              </div>

              {/* 제품 카드 */}
              {products.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    if (isDragging) return;
                    navigate(`/products/${item.id}`);
                  }}
                >
                  <ProductInfoCard
                    name={item.name}
                    img={item.img}
                    desc={item.desc}
                  />
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* 아래 영역 */}
        <div className="flex gap-[25px] mt-[20px] h-[300px]">

          {/* Warranty */}
          <div className="w-[320px] bg-white rounded-[30px] p-[20px] flex flex-col h-full">
            <h2 className="text-title-main text-primary-01 mb-[10px]">
              Warranty
            </h2>

            <div className="flex-1 overflow-y-auto pr-[5px] flex flex-col gap-[10px] no-scrollbar">
              {warrantyList.map((item, idx) => {
                const status = getProductStatus(item.remainingDays);

                const statusColor =
                  status === "expired"
                    ? "bg-gray-400"
                    : status === "danger"
                    ? "bg-red-500"
                    : status === "imminent"
                    ? "bg-[#D2D53A]"
                    : "bg-green-500";

                const statusText =
                  status === "expired"
                    ? "보증만료"
                    : status === "danger"
                    ? "보증위험"
                    : status === "imminent"
                    ? "보증임박"
                    : "보증정상";

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b-2 border-gray-02 pb-[5px]"
                  >
                    <span className="text-body-r-12">{item.name}</span>

                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`w-[12px] h-[12px] rounded-full ${statusColor}`}
                      />
                      <span className="text-body-m-10 text-gray-01">
                        {statusText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* statistics */}
          <div className="flex-1 bg-white rounded-[30px] p-[20px] flex flex-col h-full">
            <h2 className="text-title-main text-primary-01">statistics</h2>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="h-[400px] flex items-center justify-center text-gray-02">
                (통계 들어갈 영역)
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}