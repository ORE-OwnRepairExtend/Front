interface ProductInfoCardProps {
  name: string;
  img: string;
  desc?: string;
}

export default function ProductInfoCard({
  name,
  img,
  desc,
}: ProductInfoCardProps) {
  return (
    <div className="w-[135px] h-[135px] mb-[3px]">
      
      {/* 카드 */}
      <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-sm">
        
        {/* 이미지 */}
        <img
          src={img}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none"
        />

        {/* 하단 오버레이 바 */}
        <div
        className="
            absolute
            bottom-[10px] left-1/2 -translate-x-1/2
            w-[110px]
            bg-neutral-01/80 
            px-[12px] py-[8px]
            rounded-[10px]
            shadow-sm
        "
        >
        <span className="text-[14px] font-semibold text-primary-01 block leading-none">
            {name}
        </span>

        {desc && (
            <span className="text-[11px] text-gray-01 leading-none mt-[2px] block">
            {desc}
            </span>
        )}
        </div>
      </div>
    </div>
  );
}