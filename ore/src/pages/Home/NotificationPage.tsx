import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import NotificationCard from "../../components/common/NotificationCard";
import Header from "../../components/header/Header";
import CommonButton from "../../components/common/CommonButton";
import Modal from "../../components/common/Modal";
import FamilyAcceptModal from "../../components/my/FamilyAcceptModal";
import { useNotificationStore } from "../../store/notificationStore";
import { api } from "../../api/api";
import { readNotification, readAllNotifications } from "../../api/notification";

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

type FamilyNotification = {
  id: string;
  type: "request" | "accepted" | "warranty";
  requesterName: string;
  requesterEmail: string;
  nickname?: string;
  message: string;
  date: string;
  isRead: boolean;
  status: "family" | NotificationStatus;
};

const statusMap: Record<ApiNotificationStatus, NotificationStatus> = {
  IMMINENT: "imminent",
  DANGER: "danger",
  EXPIRED: "expired",
};

// 가족 API 연동 전 화면 확인용 목업
const mockFamilyNotifications: FamilyNotification[] = [
  {
    id: "family-request-1",
    type: "request",
    requesterName: "ORE User2",
    requesterEmail: "oreuser2@gmail.com",
    message: "ORE User2 님이 가족 등록을 요청하였습니다.",
    date: "2026-03-16",
    isRead: false,
    status: "family",
  },
  {
    id: "family-accepted-1",
    type: "accepted",
    requesterName: "ORE User2",
    requesterEmail: "oreuser2@gmail.com",
    message: "ORE User2 님과 가족 등록이 수락되었습니다.",
    date: "2026-03-16",
    isRead: false,
    status: "family",
  },
  {
    id: "family-warranty-1",
    type: "warranty",
    requesterName: "ORE User2",
    requesterEmail: "oreuser2@gmail.com",
    message: "ORE User2 님의 제품의 보증 상태가 위험으로 변경되었습니다.",
    date: "2026-03-16",
    isRead: false,
    status: "danger",
  },
];

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

  const [familyNotifications, setFamilyNotifications] = useState<
    FamilyNotification[]
  >(mockFamilyNotifications);

  const [selectedFamilyRequest, setSelectedFamilyRequest] =
    useState<FamilyNotification | null>(null);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allIds = [
    ...familyNotifications.map((item) => item.id),
    ...notifications.map((item) => item.id),
  ];

  // 최초 데이터 세팅
  useEffect(() => {
    let isActive = true;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);

        const response = await api.get<ApiNotification[]>("/notifications");

        if (!isActive) return;

        const mappedNotifications: NotificationItem[] = response.data.map(
          (item) => ({
            id: item.notificationId,
            productId: item.productId,
            title: item.productNickname,
            subtitle: item.productName,
            message: item.message,
            date: formatNotificationDate(item.createdAt),
            isRead: item.isRead,
            status: statusMap[item.status] ?? "imminent",
          }),
        );

        setNotifications(mappedNotifications);
      } catch (error) {
        if (isActive) {
          console.error("알림 목록 조회 실패:", error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchNotifications();

    return () => {
      isActive = false;
    };
  }, [setNotifications]);

  // 읽음 처리
  const handleRead = async (id: string) => {
    if (isSelectMode) return;

    try {
      await readNotification(id);
      markAsRead(id);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleFamilyRead = (id: string) => {
    setFamilyNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
  };

  // 선택 토글
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  // 전체 선택 / 해제
  const handleSelectAll = () => {
    const isAllSelected =
      allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

    setSelectedIds(isAllSelected ? [] : allIds);
  };

  // 삭제
  const handleDelete = () => {
    deleteNotifications(selectedIds);

    setFamilyNotifications((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );

    setSelectedIds([]);
    setIsSelectMode(false);
  };

  // 전체 읽음
  const handleAllRead = async () => {
    setFamilyNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true })),
    );

    try {
      await readAllNotifications();
      markAllAsRead();
    } catch (error) {
      console.error("알림 전체 읽음 처리 실패:", error);
    }
  };

  const handleOpenFamilyRequest = (item: FamilyNotification) => {
    setSelectedFamilyRequest(item);
  };

  const handleRejectFamilyRequest = async (id: string) => {
    // TODO: 가족 요청 거절 API 성공 후 목록에서 제거
    setFamilyNotifications((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  const handleAcceptFamilyRequest = async (
    request: FamilyNotification,
    nickname: string,
  ) => {
    // TODO: 가족 요청 수락 API에 요청 ID와 nickname 전달
    setFamilyNotifications((prev) =>
      prev.map((item) =>
        item.id === request.id && item.type === "request"
          ? {
              ...item,
              type: "accepted",
              nickname,
              message: `${item.requesterName} 님과 가족 등록이 수락되었습니다.`,
              isRead: true,
              status: "family",
            }
          : item,
      ),
    );
  };

  const renderCheckbox = (id: string) => {
    if (!isSelectMode) return null;

    const isSelected = selectedIds.includes(id);

    return (
      <button
        type="button"
        onClick={() => toggleSelect(id)}
        aria-label={isSelected ? "알림 선택 해제" : "알림 선택"}
        aria-pressed={isSelected}
        className="shrink-0 cursor-pointer"
      >
        <img
          src={isSelected ? checkedIcon : uncheckedIcon}
          alt=""
          className="h-[24px] w-[24px]"
        />
      </button>
    );
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col gap-[20px]">
        <Header title="Alarm" showNotification={false} />

        {/* 리스트 */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex flex-col gap-[20px] overflow-y-auto px-[20px] no-scrollbar">
            {familyNotifications.map((item) => (
              <div key={item.id} className="flex items-center gap-[10px]">
                {renderCheckbox(item.id)}

                <div
                  className={`
                    min-w-0 flex-1 transition-all duration-200
                    ${isSelectMode ? "translate-x-[5px]" : ""}
                  `}
                >
                  <NotificationCard
                    title="Family"
                    message={item.message}
                    date={item.date}
                    isRead={item.isRead}
                    status={item.status}
                    emphasizedText={item.requesterName}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelect(item.id);
                        return;
                      }

                      handleFamilyRead(item.id);
                    }}
                  >
                    {item.type === "request" && !isSelectMode && (
                      <>
                        <CommonButton
                          onClick={() => handleOpenFamilyRequest(item)}
                          className="!h-[26px] !text-body-sb-12"
                        >
                          수락
                        </CommonButton>

                        <CommonButton
                          variant="secondary"
                          onClick={() => {
                            void handleRejectFamilyRequest(item.id);
                          }}
                          className="
                            !h-[26px] !bg-gray-02
                            !text-body-sb-12 !text-gray-01
                          "
                        >
                          거절
                        </CommonButton>
                      </>
                    )}
                  </NotificationCard>
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex items-center justify-center py-[20px] text-body-m-14 text-neutral-02">
                알림을 불러오는 중입니다.
              </div>
            ) : allIds.length === 0 ? (
              <div className="flex items-center justify-center py-[20px] text-body-m-14 text-neutral-02">
                등록된 알림이 없습니다.
              </div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="flex items-center gap-[10px]">
                  {renderCheckbox(item.id)}

                  {/* 카드 */}
                  <div
                    className={`
                      min-w-0 flex-1 transition-all duration-200
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
                      onClick={async () => {
                        if (isSelectMode) {
                          toggleSelect(item.id);
                          return;
                        }

                        await handleRead(item.id);
                        navigate(`/products/${item.productId}`);
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-wrap justify-end gap-[10px] px-[20px] pb-[20px]">
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
                {allIds.length > 0 &&
                allIds.every((id) => selectedIds.includes(id))
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

        {selectedFamilyRequest && (
          <FamilyAcceptModal
            key={selectedFamilyRequest.id}
            requesterName={selectedFamilyRequest.requesterName}
            requesterEmail={selectedFamilyRequest.requesterEmail}
            onClose={() => setSelectedFamilyRequest(null)}
            onAccept={(nickname) =>
              handleAcceptFamilyRequest(selectedFamilyRequest, nickname)
            }
            onReject={() =>
              handleRejectFamilyRequest(selectedFamilyRequest.id)
            }
          />
        )}
      </div>
    </MainLayout>
  );
}