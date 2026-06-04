import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import NotificationCard from "../../components/common/NotificationCard";
import Header from "../../components/header/Header";
import CommonButton from "../../components/common/CommonButton";
import Modal from "../../components/common/Modal";
import { useNotificationStore } from "../../store/notificationStore";
import { api } from "../../api/api";

import checkedIcon from "../../assets/checked.svg";
import uncheckedIcon from "../../assets/unchecked.svg";

type ApiNotificationStatus = "IMMINENT" | "DANGER" | "EXPIRED";

type ApiNotification = {
  notificationId: string;
  productId: string;
  productName: string;
  productNickname: string;
  reminderId: string | null;
  notificationType: string;
  status: ApiNotificationStatus;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationStatus = "imminent" | "danger" | "expired";

type NotificationItem = {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  message: string;
  date: string;
  isRead: boolean;
  status: NotificationStatus;
};

const statusMap: Record<ApiNotificationStatus, NotificationStatus> = {
  IMMINENT: "imminent",
  DANGER: "danger",
  EXPIRED: "expired",
};

const formatNotificationDate = (createdAt: string) => {
  return createdAt.split("T")[0];
};

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 최초 데이터 세팅
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);

        const response = await api.get<ApiNotification[]>("/notifications");

        const mappedNotifications: NotificationItem[] = response.data.map(
          (item) => ({
            id: item.notificationId,
            productId: item.productId,
            title: item.productName,
            subtitle: item.productNickname,
            message: item.message,
            date: formatNotificationDate(item.createdAt),
            isRead: item.isRead,
            status: statusMap[item.status] ?? "imminent",
          }),
        );

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("알림 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [setNotifications]);

  // 읽음 처리
  const handleRead = (id: string) => {
    if (isSelectMode) return;
    markAsRead(id);
  };

  // 선택 토글
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
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
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-body-m-14 text-neutral-02">
                알림을 불러오는 중입니다.
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-body-m-14 text-neutral-02">
                등록된 알림이 없습니다.
              </div>
            ) : (
              notifications.map((item) => {
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
              })
            )}
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