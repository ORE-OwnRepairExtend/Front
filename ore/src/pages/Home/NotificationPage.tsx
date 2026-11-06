import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layout/MainLayout";
import NotificationCard from "../../components/common/NotificationCard";
import Header from "../../components/header/Header";
import CommonButton from "../../components/common/CommonButton";
import Modal from "../../components/common/Modal";
import FamilyAcceptModal from "../../components/my/FamilyAcceptModal";

import { useNotificationStore } from "../../store/notificationStore";
import { api } from "../../api/api";
import {
  readNotification,
  readAllNotifications,
} from "../../api/notification";
import {
  getFamilyErrorMessage,
  respondFamilyInvitation,
  type FamilyInvitationStatus,
} from "../../api/family";

import checkedIcon from "../../assets/checked.svg";
import uncheckedIcon from "../../assets/unchecked.svg";

type ApiNotificationStatus = "IMMINENT" | "DANGER" | "EXPIRED";

type ApiNotification = {
  notificationId: string;
  productId: string | null;
  productName: string | null;
  productNickname: string | null;
  reminderId: string | null;
  notificationType: string;
  referenceId: string | null;
  referenceType: string | null;
  status: ApiNotificationStatus | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Invitation = {
  notificationId: string;
  invitationId: string;
};

type NotificationStatus = "imminent" | "danger" | "expired";

const statusMap: Record<ApiNotificationStatus, NotificationStatus> = {
  IMMINENT: "imminent",
  DANGER: "danger",
  EXPIRED: "expired",
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

  const [invitations, setInvitations] = useState<
    Record<string, Invitation>
  >({});

  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  const [processedInvitations, setProcessedInvitations] = useState<
    Record<string, FamilyInvitationStatus>
  >({});

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [pendingInvitationId, setPendingInvitationId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  const respondingRef = useRef(false);
  const requestSequenceRef = useRef(0);

  const visibleNotifications = notifications.filter((item) => {
    const invitation = invitations[item.id];

    return (
      !invitation ||
      processedInvitations[invitation.invitationId] !== "REJECTED"
    );
  });

  const selectedVisibleIds = visibleNotifications
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.id);

  // 알림 조회 및 가족 초대 정보 분리
  const fetchNotifications = useCallback(async () => {
    const requestSequence = ++requestSequenceRef.current;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get<ApiNotification[]>("/notifications");

      if (requestSequence !== requestSequenceRef.current) return;

      const nextInvitations: Record<string, Invitation> = {};

      const mappedNotifications = response.data.map((item) => {
        const isFamilyInvitation =
          item.notificationType === "FAMILY_INVITATION" &&
          item.referenceType === "FAMILY_INVITATION";

        const invitationId =
          isFamilyInvitation && typeof item.referenceId === "string"
            ? item.referenceId.trim()
            : "";

        if (invitationId) {
          nextInvitations[item.notificationId] = {
            notificationId: item.notificationId,
            invitationId,
          };
        }

        return {
          id: item.notificationId,
          productId: item.productId ?? "",
          title: isFamilyInvitation
            ? "Family"
            : item.productNickname || item.productName || "알림",
          subtitle: isFamilyInvitation ? "" : item.productName ?? "",
          message: item.message,
          date: item.createdAt.split("T")[0],
          isRead: item.isRead,
          status: item.status
            ? statusMap[item.status] ?? "imminent"
            : "imminent",
        };
      });

      setNotifications(mappedNotifications);
      setInvitations(nextInvitations);

      setSelectedIds((prev) =>
        prev.filter((id) =>
          mappedNotifications.some((item) => item.id === id),
        ),
      );
    } catch (error) {
      if (requestSequence !== requestSequenceRef.current) return;

      setErrorMessage(
        getFamilyErrorMessage(error, "알림 목록을 불러오지 못했습니다."),
      );
    } finally {
      if (requestSequence === requestSequenceRef.current) {
        setIsLoading(false);
      }
    }
  }, [setNotifications]);

  // 최초 데이터 세팅
  useEffect(() => {
    void fetchNotifications();

    return () => {
      requestSequenceRef.current += 1;
    };
  }, [fetchNotifications]);

  // 읽음 처리
  const handleRead = async (id: string) => {
    const notification = notifications.find((item) => item.id === id);

    if (notification?.isRead) return;

    try {
      await readNotification(id);
      markAsRead(id);
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(error, "알림 읽음 처리에 실패했습니다."),
      );
    }
  };

  // 선택 토글
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((value) => value !== id)
        : [...prev, id],
    );
  };

  // 전체 선택 / 해제
  const handleSelectAll = () => {
    const isAllSelected =
      visibleNotifications.length > 0 &&
      visibleNotifications.every((item) =>
        selectedIds.includes(item.id),
      );

    setSelectedIds(
      isAllSelected
        ? []
        : visibleNotifications.map((item) => item.id),
    );
  };

  // 삭제: 기존처럼 화면 목록에서만 제거
  const handleDelete = () => {
    deleteNotifications(selectedVisibleIds);
    setSelectedIds([]);
    setIsSelectMode(false);
    setIsModalOpen(false);
  };

  // 전체 읽음
  const handleAllRead = async () => {
    try {
      await readAllNotifications();
      markAllAsRead();
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(error, "알림 전체 읽음 처리에 실패했습니다."),
      );
    }
  };

  // 가족 초대 수락 / 거절
  const handleRespondInvitation = async (
    invitation: Invitation,
    status: FamilyInvitationStatus,
    nickname?: string,
  ) => {
    if (respondingRef.current) {
      throw new Error("가족 요청을 처리 중입니다.");
    }

    if (!invitation.invitationId) {
      throw new Error("초대 ID가 없어 가족 요청을 처리할 수 없습니다.");
    }

    try {
      respondingRef.current = true;
      setPendingInvitationId(invitation.invitationId);
      setErrorMessage("");
      setNotice("");

      await respondFamilyInvitation(
        invitation.invitationId,
        status,
        nickname,
      );

      // 수락·거절 API에서 알림도 자동 읽음 처리
      markAsRead(invitation.notificationId);

      setProcessedInvitations((prev) => ({
        ...prev,
        [invitation.invitationId]: status,
      }));

      setSelectedIds((prev) =>
        prev.filter((id) => id !== invitation.notificationId),
      );

      setNotice(
        status === "ACCEPTED"
          ? "가족 요청을 수락했습니다."
          : "가족 요청을 거절했습니다.",
      );

      // 성공 후 서버 목록으로 갱신
      // 조회 실패는 수락·거절 실패와 별도로 안내
      await fetchNotifications();
    } finally {
      respondingRef.current = false;
      setPendingInvitationId(null);
    }
  };

  const handleReject = async (invitation: Invitation) => {
    try {
      await handleRespondInvitation(invitation, "REJECTED");
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(error, "가족 요청 거절에 실패했습니다."),
      );
    }
  };

  return (
    <MainLayout>
      <div className="flex h-full flex-col gap-[20px]">
        <Header title="Alarm" showNotification={false} />

        {notice && (
          <p
            role="status"
            className="px-[20px] text-body-r-12 text-primary-01"
          >
            {notice}
          </p>
        )}

        {errorMessage && (
          <div className="flex items-center gap-[10px] px-[20px]">
            <p role="alert" className="text-body-r-12 text-red-500">
              {errorMessage}
            </p>

            <button
              type="button"
              disabled={isLoading || pendingInvitationId !== null}
              onClick={() => void fetchNotifications()}
              className="
                shrink-0 cursor-pointer
                text-body-r-12 text-primary-01
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              다시 조회
            </button>
          </div>
        )}

        {/* 리스트 */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex flex-col gap-[20px] overflow-y-auto px-[20px] no-scrollbar">
            {isLoading ? (
              <p className="py-[20px] text-center text-body-m-14 text-neutral-02">
                알림을 불러오는 중입니다.
              </p>
            ) : visibleNotifications.length === 0 ? (
              <p className="py-[20px] text-center text-body-m-14 text-neutral-02">
                등록된 알림이 없습니다.
              </p>
            ) : (
              visibleNotifications.map((item) => {
                const invitation = invitations[item.id];

                const processedStatus = invitation
                  ? processedInvitations[invitation.invitationId]
                  : undefined;

                const isSelected = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-[10px]"
                  >
                    {/* 체크박스 */}
                    {isSelectMode && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        aria-label={
                          isSelected ? "알림 선택 해제" : "알림 선택"
                        }
                        aria-pressed={isSelected}
                        className="shrink-0 cursor-pointer"
                      >
                        <img
                          src={isSelected ? checkedIcon : uncheckedIcon}
                          alt=""
                          className="h-[24px] w-[24px]"
                        />
                      </button>
                    )}

                    {/* 카드 */}
                    <div className="min-w-0 flex-1">
                      <NotificationCard
                        title={item.title}
                        subtitle={item.subtitle}
                        message={item.message}
                        date={item.date}
                        isRead={item.isRead}
                        status={invitation ? "family" : item.status}
                        onClick={async () => {
                          if (isSelectMode) {
                            toggleSelect(item.id);
                            return;
                          }

                          await handleRead(item.id);

                          if (invitation) return;

                          if (item.productId) {
                            navigate(`/products/${item.productId}`);
                          }
                        }}
                      >
                        {invitation &&
                          !processedStatus &&
                          !isSelectMode && (
                            <fieldset
                              disabled={pendingInvitationId !== null}
                              className="
                                flex min-w-0 items-center gap-[10px]
                                border-0 p-0
                                disabled:opacity-50
                              "
                            >
                              <CommonButton
                                onClick={() => {
                                  if (respondingRef.current) return;
                                  setSelectedInvitation(invitation);
                                }}
                                className="!h-[26px] !text-body-sb-12"
                              >
                                수락
                              </CommonButton>

                              <CommonButton
                                variant="secondary"
                                onClick={() => {
                                  void handleReject(invitation);
                                }}
                                className="
                                  !h-[26px] !bg-gray-02
                                  !text-body-sb-12 !text-gray-01
                                "
                              >
                                거절
                              </CommonButton>
                            </fieldset>
                          )}

                        {processedStatus === "ACCEPTED" && (
                          <span className="text-body-sb-12 text-primary-01">
                            수락 완료
                          </span>
                        )}
                      </NotificationCard>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-wrap justify-end gap-[10px] px-[20px] pb-[20px]">
          {!isSelectMode ? (
            <>
              <CommonButton
                onClick={handleAllRead}
                variant="secondary"
              >
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

              <CommonButton
                variant="secondary"
                onClick={handleSelectAll}
              >
                {visibleNotifications.length > 0 &&
                visibleNotifications.every((item) =>
                  selectedIds.includes(item.id),
                )
                  ? "전체해제"
                  : "전체선택"}
              </CommonButton>

              <CommonButton
                onClick={() => {
                  if (selectedVisibleIds.length === 0) return;
                  setIsModalOpen(true);
                }}
                className={
                  selectedVisibleIds.length === 0
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
          onConfirm={handleDelete}
          cancelText="취소"
          confirmText="삭제"
        />

        {selectedInvitation && (
          <FamilyAcceptModal
            key={selectedInvitation.invitationId}
            onClose={() => setSelectedInvitation(null)}
            onAccept={(nickname) =>
              handleRespondInvitation(
                selectedInvitation,
                "ACCEPTED",
                nickname,
              )
            }
            onReject={() =>
              handleRespondInvitation(
                selectedInvitation,
                "REJECTED",
              )
            }
          />
        )}
      </div>
    </MainLayout>
  );
}