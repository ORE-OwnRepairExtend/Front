import { useState } from "react";
import type {
  MaintenanceHistoryItem,
  MaintenanceTimelineItem,
} from "../../utils/maintenanceDate";
import { getMaintenanceTimeline } from "../../utils/maintenanceDate";
import CategoryButton from "../category/CategoryButton";

type MaintenanceCategory = {
  id: string;
  label: string;
  replacementCycleMonths: number;
  replacementHistories: MaintenanceHistoryItem[];
};

type ProductMaintenanceInfoProps = {
  purchaseDate: string;
  categories: MaintenanceCategory[];
  onEditClick?: () => void;
};

const TIMELINE_STYLE: Record<MaintenanceTimelineItem["type"], string> = {
  recommended: "bg-secondary-01",
  replaced: "bg-primary-01",
  purchase: "bg-primary-01",
};

export default function ProductMaintenanceInfo({
  purchaseDate,
  categories,
  onEditClick,
}: ProductMaintenanceInfoProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0];

  if (!selectedCategory) return null;

  const timeline = getMaintenanceTimeline(
    purchaseDate,
    selectedCategory.replacementCycleMonths,
    selectedCategory.replacementHistories,
  );

  return (
    <section className="flex w-full flex-col items-start gap-[20px] px-[10px]">
      <div className="flex w-full flex-col items-start gap-[10px] ">
        {/* 제목 + 수정하기 */}
        <div className="flex w-full items-center justify-between">
          <h3 className="text-body-sb-20 text-primary-01">관리 이력</h3>

          <button
            type="button"
            onClick={onEditClick}
            className="flex items-center gap-[15px] text-body-m-16 cursor-pointer"
          >
            수정하기
            <img src="/icons/forword_black.svg" alt="수정하기" height={24} />
          </button>
        </div>

        {/* 부품 카테고리 */}
        <div className="flex w-full items-center gap-[10px]">
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              label={category.label}
              isSelected={selectedCategory.id === category.id}
              onClick={() => setSelectedCategoryId(category.id)}
            />
          ))}
        </div>

        <p className="text-body-m-16 text-black">
          권장 교체 주기 : {selectedCategory.replacementCycleMonths}개월
        </p>
      </div>

      <div className="flex w-full items-start gap-[10px] rounded-[30px] bg-white/50 px-[40px] py-[20px]">
        <div className="relative flex flex-col gap-[30px] pl-[10px]">
          {/* 세로 점선 */}
          <div
            className="
      absolute left-[16.5px] top-[10px] h-[calc(100%-20px)]
      border-l-2 border-dashed border-gray-01
    "
          />

          {timeline.map((item) => (
            <div
              key={`${item.type}-${item.date}`}
              className="relative flex items-center gap-[10px]"
            >
              {/* 상태 아이콘 */}
              <span
                className={`
                  z-10 h-[15px] w-[15px] rounded-full
                  ${TIMELINE_STYLE[item.type]}
                `}
              />

              {/* 텍스트 */}
              <span className="text-body-m-16">
                · {item.label} - {item.date}{" "}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
