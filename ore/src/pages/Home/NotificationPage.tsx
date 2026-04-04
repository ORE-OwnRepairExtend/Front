import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import NotificationCard from "../../components/common/NotificationCard";
import Header from "../../components/header/Header";
import CommonButton from "../../components/common/CommonButton";
import Modal from "../../components/common/Modal";
import { getProductStatus } from "../../utils/productStatus";
import { useNotificationStore } from "../../store/notificationStore";

import checkedIcon from "../../assets/checked.svg";
import uncheckedIcon from "../../assets/unchecked.svg";

const mockNotifications = [
  {
    id: 1,
    productId: 101,
    title: "카메라",
    subtitle: "SONY-RX1R III 컴팩트 카메라",
    message: "해당 제품의 보증상태가 만료되었습니다.",
    date: "2026-03-16",
    isRead: false,
    remainingDays: -1,
  },
  {
    id: 2,
    productId: 102,
    title: "카메라",
    subtitle: "SONY-RX1R III 컴팩트 카메라",
    message: "해당 제품의 보증상태가 위험으로 변경되었습니다.",
    date: "2026-03-15",
    isRead: true,
    remainingDays: 3,
  },
  {
    id: 3,
    productId: 103,
    title: "카메라",
    subtitle: "SONY-RX1R III 컴팩트 카메라",
    message: "해당 제품의 보증상태가 임박으로 변경되었습니다.",
    date: "2026-03-15",
    isRead: true,
    remainingDays: 20,
  },
  {
    id: 4,
    productId: 104,
    title: "노트북",
    subtitle: "MacBook Pro 14",
    message: "해당 제품의 보증상태가 임박으로 변경되었습니다.",
    date: "2026-03-14",
    isRead: false,
    remainingDays: 10,
  },
  {
    id: 5,
    productId: 105,
    title: "휴대폰",
    subtitle: "iPhone 15",
    message: "해당 제품의 보증상태가 위험으로 변경되었습니다.",
    date: "2026-03-13",
    isRead: false,
    remainingDays: 2,
  },
  {
    id: 6,
    productId: 106,
    title: "냉장고",
    subtitle: "삼성 냉장고",
    message: "해당 제품의 보증상태가 만료되었습니다.",
    date: "2026-03-12",
    isRead: true,
    remainingDays: -5,
  },
];

export default function NotificationPage() {
  const navigate = useNavigate();

  const {
    notifications,
    setNotifications,
    markAsRead,
    deleteNotifications,
    markAllAsRead,
  } = useNotificationStore();

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 최초 데이터 세팅
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(mockNotifications);
    }
  }, []);

  // 읽음 처리
  const handleRead = (id: number) => {
    if (isSelectMode) return;
    markAsRead(id);
  };

  // 선택 토글
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id]
    );
  };

  // 전체 선택 / 해제
  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map((item) => item.id));
    }
  };

  // 삭제
  const handleDelete = () => {
    deleteNotifications(selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  // 전체 읽음
  const handleAllRead = () => {
    markAllAsRead();
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col gap-[20px]">
        <Header title="Alarm" showNotification={false} />

        {/* 리스트 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col gap-[20px] px-[20px] overflow-y-auto no-scrollbar">
            {notifications
              .map((item) => ({
                ...item,
                status: getProductStatus(item.remainingDays),
              }))
              .filter(
                (item): item is typeof item & {
                  status: Exclude<typeof item.status, "valid">;
                } => item.status !== "valid"
              )
              .map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div key={item.id} className="flex items-center gap-[10px]">
                    
                    {/* 체크박스 */}
                    {isSelectMode && (
                      <img
                        src={isSelected ? checkedIcon : uncheckedIcon}
                        alt="check"
                        className="w-[24px] h-[24px] cursor-pointer"
                        onClick={() => toggleSelect(item.id)}
                      />
                    )}

                    {/* 카드 */}
                    <div
                      className={`
                        flex-1 transition-all duration-200
                        ${isSelectMode ? "translate-x-[5px]" : ""}
                      `}
                    >
                      <NotificationCard
                        title={item.title}
                        subtitle={item.subtitle}
                        message={item.message}
                        date={item.date}
                        isRead={item.isRead}
                        status={item.status}
                        onClick={() =>
                          isSelectMode
                            ? toggleSelect(item.id)
                            : (() => {
                                handleRead(item.id);
                                navigate(`/products/${item.productId}`);
                              })()
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-[10px] px-[20px] pb-[20px]">
          {!isSelectMode ? (
            <>
              <CommonButton onClick={handleAllRead} variant="secondary">
                전체읽음
              </CommonButton>
              <CommonButton onClick={() => setIsSelectMode(true)}>
                선택
              </CommonButton>
            </>
          ) : (
            <>
              <CommonButton
                variant="secondary"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedIds([]);
                }}
              >
                취소
              </CommonButton>

              <CommonButton variant="secondary" onClick={handleSelectAll}>
                {selectedIds.length === notifications.length
                  ? "전체해제"
                  : "전체선택"}
              </CommonButton>

              <CommonButton
                onClick={() => {
                  if (selectedIds.length === 0) return;
                  setIsModalOpen(true);
                }}
                className={
                  selectedIds.length === 0
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }
              >
                삭제
              </CommonButton>
            </>
          )}
        </div>

        <Modal
          open={isModalOpen}
          title="해당 알림을 삭제하시겠습니까?"
          onClose={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleDelete();
            setIsModalOpen(false);
          }}
          cancelText="취소"
          confirmText="삭제"
        />
      </div>
    </MainLayout>
  );
}