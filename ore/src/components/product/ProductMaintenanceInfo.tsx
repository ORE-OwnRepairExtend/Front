import { useState } from "react";

import forwardBlackIcon from "../../assets/icons/forword_black.svg";
import closeFillCircleIcon from "../../assets/icons/close_fill_circle.svg";

import type {
  MaintenanceHistoryItem,
  MaintenanceTimelineItem,
} from "../../utils/maintenanceDate";
import { getMaintenanceTimeline } from "../../utils/maintenanceDate";

import CategoryButton from "../category/CategoryButton";
import ProductInputBox from "../product/ProductInputBox";
import CommonButton from "../common/CommonButton";
import DeleteButton from "../common/DeleteButton";
import Modal from "../common/Modal";

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
  onSave?: (data: {
    purchaseDate: string;
    categories: MaintenanceCategory[];
  }) => void;
  onEditingChange?: (isEditing: boolean) => void;
};

const TIMELINE_STYLE: Record<MaintenanceTimelineItem["type"], string> = {
  recommended: "bg-secondary-01",
  replaced: "bg-primary-01",
  purchase: "bg-primary-01",
};

const toDateInputValue = (date: string) => date.replaceAll(".", "-");
const toDisplayDate = (date: string) => date.replaceAll("-", ".");

export default function ProductMaintenanceInfo({
  purchaseDate,
  categories,
  onEditClick,
  onSave,
  onEditingChange,
}: ProductMaintenanceInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id ?? "",
  );

  const [editablePurchaseDate, setEditablePurchaseDate] = useState(
    toDateInputValue(purchaseDate),
  );

  const [editableCategories, setEditableCategories] =
    useState<MaintenanceCategory[]>(categories);

  const selectedCategory =
    editableCategories.find((category) => category.id === selectedCategoryId) ??
    editableCategories[0];

  if (!selectedCategory) return null;

  const timeline = getMaintenanceTimeline(
    toDisplayDate(editablePurchaseDate),
    selectedCategory.replacementCycleMonths,
    selectedCategory.replacementHistories,
  );

  const handleEditClick = () => {
    setIsEditing(true);
    onEditingChange?.(true);
    onEditClick?.();
  };

  const handleSave = () => {
    setIsEditing(false);
    onEditingChange?.(false);

    onSave?.({
      purchaseDate: toDisplayDate(editablePurchaseDate),
      categories: editableCategories,
    });
  };

  const handleCycleChange = (value: string) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");

    setEditableCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              replacementCycleMonths: Number(onlyNumber),
            }
          : category,
      ),
    );
  };

  const handleHistoryDateChange = (index: number, value: string) => {
    setEditableCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              replacementHistories: category.replacementHistories.map(
                (history, historyIndex) =>
                  historyIndex === index
                    ? {
                        ...history,
                        replacedDate: toDisplayDate(value),
                      }
                    : history,
              ),
            }
          : category,
      ),
    );
  };

  const handleAddHistory = () => {
    setEditableCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              replacementHistories: [
                ...category.replacementHistories,
                {
                  id: `history-${Date.now()}`,
                  replacedDate: "",
                },
              ],
            }
          : category,
      ),
    );
  };

  const handleDeleteHistory = (index: number) => {
    setEditableCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              replacementHistories: category.replacementHistories.filter(
                (_, historyIndex) => historyIndex !== index,
              ),
            }
          : category,
      ),
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setEditableCategories((prev) => {
      const nextCategories = prev.filter(
        (category) => category.id !== categoryId,
      );

      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(nextCategories[0]?.id ?? "");
      }

      return nextCategories;
    });
  };

  const handleOpenDeleteCategoryModal = (categoryId: string) => {
    setDeleteCategoryId(categoryId);
  };

  const handleCloseDeleteCategoryModal = () => {
    setDeleteCategoryId(null);
  };

  const handleConfirmDeleteCategory = () => {
    if (!deleteCategoryId) return;

    handleDeleteCategory(deleteCategoryId);
    setDeleteCategoryId(null);
  };

  return (
    <>
      <section className="flex w-full flex-col items-start gap-[20px] px-[10px]">
        <div className="flex w-full flex-col items-start gap-[10px]">
          {/* 제목 + 수정/저장 */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-body-sb-20 text-primary-01">관리 이력</h3>

            <button
              type="button"
              onClick={isEditing ? handleSave : handleEditClick}
              className="flex cursor-pointer items-center gap-[15px] text-body-m-16"
            >
              {isEditing ? "저장" : "수정하기"}

              <img
                src={forwardBlackIcon}
                alt={isEditing ? "저장" : "수정하기"}
                height={24}
              />
            </button>
          </div>

          {/* 부품 카테고리 */}
          <div className="flex w-full items-center gap-[10px]">
            {editableCategories.map((category) => {
              const isSelected = selectedCategory.id === category.id;

              if (isEditing && isSelected) {
                return (
                  <div
                    key={category.id}
                    className="
                      flex h-[44px] w-[97px] items-center justify-center gap-[6px]
                      rounded-full border-3 border-primary-01
                      bg-secondary-01 text-body-sb-16 text-primary-01
                    "
                  >
                    <span>{category.label}</span>

                    <button
                      type="button"
                      aria-label={`${category.label} 삭제`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDeleteCategoryModal(category.id);
                      }}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <img
                        src={closeFillCircleIcon}
                        alt=""
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                );
              }

              return (
                <CategoryButton
                  key={category.id}
                  label={category.label}
                  isSelected={isSelected}
                  onClick={() => setSelectedCategoryId(category.id)}
                />
              );
            })}
          </div>

          {!isEditing ? (
            <p className="text-body-m-16 text-black">
              권장 교체 주기 : {selectedCategory.replacementCycleMonths}개월
            </p>
          ) : (
            <div className="flex items-center gap-[20px] text-body-m-16">
              <span className="text-black">권장 교체 주기 :</span>

              <ProductInputBox
                value={String(selectedCategory.replacementCycleMonths || "")}
                onChange={(e) => handleCycleChange(e.target.value)}
                suffix="개월"
                className="h-[40px] w-[100px]"
              />
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="flex w-full items-start gap-[10px] rounded-[30px] bg-white/50 px-[40px] py-[20px]">
            <div className="relative flex flex-col gap-[30px] pl-[10px]">
              {/* 세로 점선 */}
              <div className="absolute left-[16.5px] top-[10px] h-[calc(100%-20px)] border-l-2 border-dashed border-gray-01" />

              {timeline.map((item) => (
                <div
                  key={`${item.type}-${item.date}`}
                  className="relative flex items-center gap-[10px]"
                >
                  <span
                    className={`
                      z-10 h-[15px] w-[15px] rounded-full
                      ${TIMELINE_STYLE[item.type]}
                    `}
                  />

                  <span className="text-body-m-16">
                    · {item.label} - {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-full rounded-[30px] bg-white/50 px-[30px] py-[20px]">
            <div className="flex w-full flex-col gap-[20px] bg-white px-[10px] py-[10px]">
              {/* 구매일 */}
              <div className="flex min-h-[42px] items-center">
                <div className="w-[140px] px-[15px] text-body-m-16 text-black">
                  구매일
                </div>

                <ProductInputBox
                  variant="date"
                  value={editablePurchaseDate}
                  onChange={(e) => setEditablePurchaseDate(e.target.value)}
                  className="h-[40px] w-[150px]"
                />
              </div>

              {/* 교체일 */}
              <div className="flex min-h-[42px] items-start">
                <div className="w-[140px] px-[15px] pt-[7px] text-body-m-16 text-black">
                  교체일
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-col gap-[6px]">
                    {selectedCategory.replacementHistories.map(
                      (history, index) => (
                        <div
                          key={history.id}
                          className="flex items-center gap-[10px]"
                        >
                          <ProductInputBox
                            variant="date"
                            value={toDateInputValue(history.replacedDate)}
                            onChange={(e) =>
                              handleHistoryDateChange(index, e.target.value)
                            }
                            className="h-[40px] w-[150px]"
                          />

                          <DeleteButton
                            onClick={() => handleDeleteHistory(index)}
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <CommonButton
                    onClick={handleAddHistory}
                    className="mt-[15px] w-[150px]"
                  >
                    추가하기
                  </CommonButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Modal
        open={deleteCategoryId !== null}
        type="confirm"
        title="삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onClose={handleCloseDeleteCategoryModal}
        onCancel={handleCloseDeleteCategoryModal}
        onConfirm={handleConfirmDeleteCategory}
      />
    </>
  );
}