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
import { readNotification, readAllNotifications } from "../../api/notification";
import {
  getFamilyErrorMessage,
  respondFamilyInvitation,
  type FamilyInvitationStatus,
} from "../../api/family";

import RecallModal from "../../components/recall/RecallModal";
import type { RecallInfo } from "../../types/recall";
import { getRecalls } from "../../api/recall";

import {
  createMockRecallNotifications,
  isMockRecallNotification,
} from "../../utils/recallNotification";

import { hideRecallById } from "../../utils/recallStorage";

import checkedIcon from "../../assets/checked.svg";
import uncheckedIcon from "../../assets/unchecked.svg";

type ApiNotificationStatus = "IMMINENT" | "DANGER" | "EXPIRED";
type ApiInvitationStatus = "PENDING" | FamilyInvitationStatus;

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
  invitationStatus: ApiInvitationStatus | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Invitation = {
  notificationId: string;
  invitationId: string;
  status: ApiInvitationStatus;
};

type NotificationStatus = "imminent" | "danger" | "expired";

const statusMap: Record<ApiNotificationStatus, NotificationStatus> = {
  IMMINENT: "imminent",
  DANGER: "danger",
  EXPIRED: "expired",
};

// 서버에는 알림 삭제 API가 없어, 이 브라우저에서만 숨김 상태를 저장합니다.
// 계정별로 분리하여 다른 계정의 알림에 영향을 주지 않게 합니다.
function getHiddenNotificationsStorageKey(): string | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (!("userId" in parsed)) return null;

    const userId = parsed.userId;
    if (typeof userId !== "string" || !userId.trim()) return null;

    return `ore:hidden-notifications:${userId}`;
  } catch {
    return null;
  }
}

function readHiddenNotificationIds(storageKey: string | null): string[] {
  if (!storageKey) return [];

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

export default function NotificationPage() {
  const navigate = useNavigate();

  const {
    notifications,
    setNotifications,
    markAsRead,
    deleteNotifications,
    markAllAsRead,
  } = useNotificationStore();

  const [invitations, setInvitations] = useState<Record<string, Invitation>>(
    {},
  );

  // TODO: 로그인 사용자 ID로 교체
  // MainPage의 recallUserId와 동일해야 함
  const recallUserId = "mock-user";

  // 리콜 데이터 및 선택된 리콜
  const [recallList, setRecallList] = useState<RecallInfo[]>([]);
  const [selectedRecall, setSelectedRecall] = useState<RecallInfo | null>(null);

  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  const respondingRef = useRef(false);
  const requestSequenceRef = useRef(0);
  const storageKeyRef = useRef(getHiddenNotificationsStorageKey());
  const hiddenIdsRef = useRef(
    new Set(readHiddenNotificationIds(storageKeyRef.current)),
  );

  const visibleNotifications = notifications.filter((item) => {
    const invitation = invitations[item.id];
    return invitation?.status !== "REJECTED";
  });

  const selectedVisibleIds = visibleNotifications
    .filter((item) => selectedIds.includes(item.id))
    .map((item) => item.id);

  // 알림 조회 시 서버의 invitationStatus를 함께 사용합니다.
  const fetchNotifications = useCallback(async () => {
    const requestSequence = ++requestSequenceRef.current;

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get<ApiNotification[]>("/notifications");

      if (requestSequence !== requestSequenceRef.current) return;

      const nextInvitations: Record<string, Invitation> = {};

      const mappedNotifications = response.data
        .filter((item) => !hiddenIdsRef.current.has(item.notificationId))
        .map((item) => {
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
              status: item.invitationStatus ?? "PENDING",
            };
          }

          return {
            id: item.notificationId,
            productId: item.productId ?? "",
            title: isFamilyInvitation
              ? "Family"
              : item.productNickname || item.productName || "알림",
            subtitle: isFamilyInvitation ? "" : (item.productName ?? ""),
            message: item.message,
            date: item.createdAt.split("T")[0],
            isRead: item.isRead,
            status: item.status
              ? (statusMap[item.status] ?? "imminent")
              : "imminent",
          };
        });

      // Mock 리콜 정보 조회
      const recalls = await getRecalls();

      if (requestSequence !== requestSequenceRef.current) return;

      // Mock 리콜 알림 생성
      const mockRecallNotifications = createMockRecallNotifications(
        recalls,
        recallUserId,
      );

      // 기존 알림과 Mock 리콜 알림 병합
      const combinedNotifications = [
        ...mappedNotifications,
        ...mockRecallNotifications,
      ].filter((item) => !hiddenIdsRef.current.has(item.id));

      // 날짜 기준 최신순 정렬
      combinedNotifications.sort((a, b) => b.date.localeCompare(a.date));

      // 리콜 데이터 저장
      setRecallList(recalls);

      // 전체 알림 목록 저장
      setNotifications(combinedNotifications);
      setInvitations(nextInvitations);

      setSelectedIds((prev) =>
        prev.filter((id) =>
          combinedNotifications.some((item) => item.id === id),
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
  }, [setNotifications, recallUserId]);

  useEffect(() => {
    void fetchNotifications();

    return () => {
      requestSequenceRef.current += 1;
    };
  }, [fetchNotifications]);

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

  const handleRecallClick = async (
    notificationId: string,
    recallId: string,
  ) => {
    const recall = recallList.find((item) => item.recallId === recallId);

    if (!recall) {
      setErrorMessage("리콜 정보를 찾을 수 없습니다.");
      return;
    }

    const notification = notifications.find(
      (item) => item.id === notificationId,
    );

    // 이미 읽은 알림이라도 팝업은 다시 열 수 있음
    if (!notification?.isRead) {
      // 실제 서버 알림인 경우 기존 API 사용
      if (!isMockRecallNotification(notificationId)) {
        try {
          await readNotification(notificationId);
        } catch (error) {
          setErrorMessage(
            getFamilyErrorMessage(error, "리콜 알림 읽음 처리에 실패했습니다."),
          );
          return;
        }
      }

      // 메인 팝업 다시 보지 않기 처리
      const saved = hideRecallById(recallUserId, recallId);

      if (!saved) {
        setErrorMessage("리콜 확인 상태를 저장하지 못했습니다.");
        return;
      }

      markAsRead(notificationId);
    } else {
      // 기존 읽음 알림도 메인 팝업에서 제외
      const saved = hideRecallById(recallUserId, recallId);

      if (!saved) {
        setErrorMessage("리콜 확인 상태를 저장하지 못했습니다.");
        return;
      }
    }

    // 알림 페이지 위에 기존 리콜 팝업 표시
    setSelectedRecall(recall);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const isAllSelected =
      visibleNotifications.length > 0 &&
      visibleNotifications.every((item) => selectedIds.includes(item.id));

    setSelectedIds(
      isAllSelected ? [] : visibleNotifications.map((item) => item.id),
    );
  };

  // 서버 영구 삭제가 아닌, 이 브라우저에서 알림을 숨기는 방식입니다.
  const handleDelete = () => {
    if (selectedVisibleIds.length === 0) return;

    const storageKey = storageKeyRef.current;
    if (!storageKey) {
      setIsModalOpen(false);
      setErrorMessage("사용자 정보를 확인할 수 없어 알림을 숨기지 못했습니다.");
      return;
    }

    const nextHiddenIds = new Set(hiddenIdsRef.current);
    selectedVisibleIds.forEach((id) => nextHiddenIds.add(id));

    try {
      localStorage.setItem(storageKey, JSON.stringify([...nextHiddenIds]));
    } catch {
      setIsModalOpen(false);
      setErrorMessage("브라우저에 삭제 내역을 저장하지 못했습니다.");
      return;
    }

    hiddenIdsRef.current = nextHiddenIds;
    deleteNotifications(selectedVisibleIds);
    setSelectedIds([]);
    setIsSelectMode(false);
    setIsModalOpen(false);
    setNotice("선택한 알림을 삭제했습니다.");
  };

  const handleAllRead = async () => {
    try {
      setErrorMessage("");

      // 1. 기존 서버 알림 전체 읽음 처리
      await readAllNotifications();

      // 2. 리콜 알림을 메인 팝업에서 제외
      const recallIds = notifications
        .filter(
          (item) => item.notificationType === "RECALL" && item.referenceId,
        )
        .map((item) => item.referenceId as string);

      for (const recallId of new Set(recallIds)) {
        const saved = hideRecallById(recallUserId, recallId);

        if (!saved) {
          setErrorMessage("일부 리콜 확인 상태를 저장하지 못했습니다.");
          return;
        }
      }

      // 3. Zustand 읽음 상태 변경
      markAllAsRead();

      setNotice("모든 알림을 읽음 처리했습니다.");
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(error, "알림 전체 읽음 처리에 실패했습니다."),
      );
    }
  };

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

      await respondFamilyInvitation(invitation.invitationId, status, nickname);

      markAsRead(invitation.notificationId);

      // 요청 성공 즉시 버튼을 숨기고, 이후 서버 상태로 재동기화합니다.
      setInvitations((prev) => ({
        ...prev,
        [invitation.notificationId]: { ...invitation, status },
      }));

      setSelectedIds((prev) =>
        prev.filter((id) => id !== invitation.notificationId),
      );

      setNotice(
        status === "ACCEPTED"
          ? "가족 요청을 수락했습니다."
          : "가족 요청을 거절했습니다.",
      );

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
          <p role="status" className="px-[20px] text-body-r-12 text-primary-01">
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
                const processedStatus = invitation?.status;
                const isSelected = selectedIds.includes(item.id);

                return (
                  <div key={item.id} className="flex items-center gap-[10px]">
                    {/* 체크박스 */}
                    {isSelectMode && (
                      <button
                        type="button"
                        onClick={() => toggleSelect(item.id)}
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
                    )}

                    {/* 카드 */}
                    <div className="min-w-0 flex-1">
                      <NotificationCard
                        title={item.title}
                        subtitle={item.subtitle}
                        message={item.message}
                        date={item.date}
                        isRead={item.isRead}
                        status={
                          invitation || item.isFamilyRecall
                            ? "family"
                            : item.notificationType === "RECALL"
                              ? "recall"
                              : item.status
                        }
                        onClick={async () => {
                          if (isSelectMode) {
                            toggleSelect(item.id);
                            return;
                          }

                          // 리콜 알림 클릭
                          if (
                            item.notificationType === "RECALL" &&
                            item.referenceId
                          ) {
                            await handleRecallClick(item.id, item.referenceId);
                            return;
                          }

                          // 기존 일반 알림 동작 유지
                          await handleRead(item.id);

                          if (invitation) return;

                          if (item.productId) {
                            navigate(`/products/${item.productId}`);
                          }
                        }}
                      >
                        {invitation &&
                          processedStatus === "PENDING" &&
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
              handleRespondInvitation(selectedInvitation, "ACCEPTED", nickname)
            }
            onReject={() =>
              handleRespondInvitation(selectedInvitation, "REJECTED")
            }
          />
        )}

        {/* 리콜 안내 팝업 */}
        <RecallModal
          open={selectedRecall !== null}
          recall={selectedRecall}
          onClose={() => setSelectedRecall(null)}
          onHide={() => setSelectedRecall(null)}
        />
      </div>
    </MainLayout>
  );
}
