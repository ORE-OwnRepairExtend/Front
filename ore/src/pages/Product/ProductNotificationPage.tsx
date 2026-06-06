import { useParams } from "react-router-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductNotificationCard from "../../components/product/ProductNotificationCard";
import ProductNotificationModal from "../../components/product/ProductNotificationModal";
import ProductNotificationEditModal from "../../components/product/ProductNotificationEditModal";
import ProductNotificationCompleteModal from "../../components/product/ProductNotificationCompleteModal";
import RepairAlarmCreateModal from "../../components/repair/RepairAlarmCreateModal";
import { formatDate } from "../../utils/formatDate";
import { api } from "../../api/api";

type NotificationStatus = "진행중" | "완료";

type ProductNotification = {
  notificationId: string;
  productId: string;
  productName: string;
  title: string;
  date: string;
  status: NotificationStatus;
};

type ProductRepairReminderResponse = {
  reminderId: string;
  title: string;
  remindAt: string;
  isDone: boolean;
  completedAt: string | null;
  createdAt: string;
};

type ProductRepairReminderUpdateResponse = {
  reminderId: string;
  title: string;
  remindAt: string;
  isDone: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProductRepairReminderDoneResponse = {
  reminderId: string;
  isDone: boolean;
  completedAt: string | null;
  updatedAt: string;
};

function formatNotificationDate(date: string) {
  const normalizedDate = date.replaceAll(".", "-");
  const parsedDate = new Date(normalizedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return formatDate(parsedDate);
}

function toDateInputValue(date: string) {
  return date.replaceAll(".", "-");
}

function sortNotificationsByDate<T extends { date: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

function mapProductRepairReminderToNotification(
  reminder: ProductRepairReminderResponse,
  productId: string,
): ProductNotification {
  return {
    notificationId: reminder.reminderId,
    productId,
    productName: "",
    title: reminder.title,
    date: reminder.isDone
      ? reminder.completedAt ?? reminder.remindAt
      : reminder.remindAt,
    status: reminder.isDone ? "완료" : "진행중",
  };
}

export default function ProductNotificationPage() {
  const { productId } = useParams();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isMovedRef = useRef(false);

  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [alarmTitle, setAlarmTitle] = useState("");
  const [alarmDate, setAlarmDate] = useState("");
  const [isAlarmSubmitting, setIsAlarmSubmitting] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<ProductNotification | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAlarmTitle, setEditAlarmTitle] = useState("");
  const [editAlarmDate, setEditAlarmDate] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeDate, setCompleteDate] = useState("");
  const [isCompleteSubmitting, setIsCompleteSubmitting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchRepairReminders = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      setErrorMessage("제품 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get<ProductRepairReminderResponse[]>(
        `/products/${productId}/repair-reminders`,
      );

      const mappedNotifications = response.data.map((reminder) =>
        mapProductRepairReminderToNotification(reminder, productId),
      );

      setNotifications(sortNotificationsByDate(mappedNotifications));
    } catch (error) {
      console.error("특정 제품 수리 예정 목록 조회 실패:", error);
      setErrorMessage("수리 예정 목록을 불러오지 못했습니다.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchRepairReminders();
  }, [fetchRepairReminders]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    isMovedRef.current = false;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;

    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > 5) {
      isMovedRef.current = true;
    }

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleRegisterClick = () => {
    setIsAlarmModalOpen(true);
  };

  const handleCloseAlarmModal = () => {
    if (isAlarmSubmitting) return;

    setIsAlarmModalOpen(false);
    setAlarmTitle("");
    setAlarmDate("");
  };

  const handleSubmitAlarm = async () => {
    if (!productId) {
      alert("제품 정보를 찾을 수 없습니다.");
      return;
    }

    if (!alarmTitle.trim() || !alarmDate) {
      alert("알림 이름과 알림 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsAlarmSubmitting(true);

      const response = await api.post<ProductRepairReminderResponse>(
        `/products/${productId}/repair-reminders`,
        {
          title: alarmTitle.trim(),
          remindAt: alarmDate,
        },
      );

      const newNotification = mapProductRepairReminderToNotification(
        response.data,
        productId,
      );

      setNotifications((prev) =>
        sortNotificationsByDate([newNotification, ...prev]),
      );

      setIsAlarmModalOpen(false);
      setAlarmTitle("");
      setAlarmDate("");
    } catch (error) {
      console.error("수리 예정 등록 실패:", error);
      alert("수리 예정 등록에 실패했습니다.");
    } finally {
      setIsAlarmSubmitting(false);
    }
  };

  const handleCardClick = (notification: ProductNotification) => {
    if (isMovedRef.current) {
      isMovedRef.current = false;
      return;
    }

    setSelectedNotification(notification);
  };

  const handleCloseDetailModal = () => {
    setSelectedNotification(null);
    setIsCompleteModalOpen(false);
    setIsEditModalOpen(false);
    setCompleteDate("");
  };

  const handleOpenCompleteModal = () => {
    setIsCompleteModalOpen(true);
  };

  const handleCloseCompleteModal = () => {
    if (isCompleteSubmitting) return;

    setIsCompleteModalOpen(false);
    setCompleteDate("");
  };

  const handleCompleteOnlyNotification = async () => {
    if (!productId || !selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsCompleteSubmitting(true);

      const response = await api.patch<ProductRepairReminderDoneResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}/done`,
        {
          isDone: true,
          completedDate: completeDate,
        },
      );

      const completedNotification: ProductNotification = {
        ...selectedNotification,
        date: response.data.completedAt ?? completeDate,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? completedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(null);
      setIsCompleteModalOpen(false);
      setCompleteDate("");
    } catch (error) {
      console.error("수리 예정 완료 처리 실패:", error);
      alert("수리 예정 완료 처리에 실패했습니다.");
    } finally {
      setIsCompleteSubmitting(false);
    }
  };

  const handleRepairHistoryRegister = async () => {
    if (!productId || !selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsCompleteSubmitting(true);

      const response = await api.patch<ProductRepairReminderDoneResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}/done`,
        {
          isDone: true,
          completedDate: completeDate,
        },
      );

      const completedNotification: ProductNotification = {
        ...selectedNotification,
        date: response.data.completedAt ?? completeDate,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? completedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(null);
      setIsCompleteModalOpen(false);
      setCompleteDate("");

      console.log("수리 이력 등록하기");
    } catch (error) {
      console.error("수리 예정 완료 처리 실패:", error);
      alert("수리 예정 완료 처리에 실패했습니다.");
    } finally {
      setIsCompleteSubmitting(false);
    }
  };

  const handleEditNotification = () => {
    if (!selectedNotification) return;

    setEditAlarmTitle(selectedNotification.title);
    setEditAlarmDate(toDateInputValue(selectedNotification.date));
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isEditSubmitting) return;

    setIsEditModalOpen(false);
    setEditAlarmTitle("");
    setEditAlarmDate("");
  };

  const handleSubmitEditNotification = async () => {
    if (!productId || !selectedNotification) return;

    if (!editAlarmTitle.trim() || !editAlarmDate) {
      alert("알림 이름과 알림 날짜를 입력해주세요.");
      return;
    }

    try {
      setIsEditSubmitting(true);

      const response = await api.patch<ProductRepairReminderUpdateResponse>(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}`,
        {
          title: editAlarmTitle.trim(),
          remindAt: editAlarmDate,
        },
      );

      const editedNotification: ProductNotification = {
        ...selectedNotification,
        notificationId: response.data.reminderId,
        title: response.data.title,
        date: response.data.isDone
          ? response.data.completedAt ?? response.data.remindAt
          : response.data.remindAt,
        status: response.data.isDone ? "완료" : "진행중",
      };

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.map((notification) =>
            notification.notificationId === selectedNotification.notificationId
              ? editedNotification
              : notification,
          ),
        ),
      );

      setSelectedNotification(editedNotification);
      handleCloseEditModal();
    } catch (error) {
      console.error("수리 예정 정보 수정 실패:", error);
      alert("수리 예정 정보 수정에 실패했습니다.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteNotification = async () => {
    if (!productId || !selectedNotification) return;

    try {
      setIsDeleteSubmitting(true);

      await api.delete(
        `/products/${productId}/repair-reminders/${selectedNotification.notificationId}`,
      );

      setNotifications((prev) =>
        sortNotificationsByDate(
          prev.filter(
            (notification) =>
              notification.notificationId !== selectedNotification.notificationId,
          ),
        ),
      );

      setSelectedNotification(null);
    } catch (error) {
      console.error("수리 예정 삭제 실패:", error);
      alert("수리 예정 삭제에 실패했습니다.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const scheduledNotifications = sortNotificationsByDate(
    notifications.filter((notification) => notification.status === "진행중"),
  );

  const completedNotifications = sortNotificationsByDate(
    notifications.filter((notification) => notification.status === "완료"),
  );

  if (isLoading) {
    return (
      <SecondLayout>
        <div className="flex h-full flex-col">
          <Header title="Product" showNotification={false} showCloseButton />
          <div className="flex flex-1 items-center justify-center text-body-m-16 text-gray-01">
            수리 예정 목록을 불러오는 중입니다.
          </div>
        </div>
      </SecondLayout>
    );
  }

  if (errorMessage) {
    return (
      <SecondLayout>
        <div className="flex h-full flex-col">
          <Header title="Product" showNotification={false} showCloseButton />
          <div className="flex flex-1 items-center justify-center text-body-m-16 text-gray-01">
            {errorMessage}
          </div>
        </div>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="Product" showNotification={false} showCloseButton />

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col">
          <div className="my-[10px] flex flex-1 flex-col items-center overflow-y-auto no-scrollbar">
            <section className="flex w-full flex-col gap-[20px] rounded-[30px] bg-white/50 px-[40px] py-[30px]">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-title-main text-primary-02">
                  예정된 알림
                </h2>

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="rounded-[10px] bg-secondary-01 px-[14px] py-[8px] text-button-main text-primary-01"
                >
                  알림 등록하기
                </button>
              </div>

              {scheduledNotifications.length > 0 ? (
                <div
                  ref={scrollRef}
                  className={`w-full select-none overflow-x-auto no-scrollbar ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex w-max items-center gap-[20px]">
                    {scheduledNotifications.map((notification) => (
                      <ProductNotificationCard
                        key={notification.notificationId}
                        title={notification.title}
                        date={formatNotificationDate(notification.date)}
                        status={notification.status}
                        onClick={() => handleCardClick(notification)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-[136px] w-full items-center justify-center rounded-[20px] bg-white text-body-m-16 text-gray-01">
                  예정된 알림이 없습니다.
                </div>
              )}

              <div className="h-[2px] w-full bg-gray-02/50" />

              <div className="flex w-full items-center justify-between">
                <h2 className="text-title-main text-primary-02">
                  완료된 알림
                </h2>
              </div>

              {completedNotifications.length > 0 ? (
                <div className="flex w-full flex-col gap-[10px]">
                  {completedNotifications.map((notification) => (
                    <div
                      key={notification.notificationId}
                      className="flex w-full items-center rounded-[10px] bg-white px-[18px] py-[10px] text-left"
                    >
                      <p className="text-body-sb-16 text-black">
                        {notification.title} -{" "}
                        {formatNotificationDate(notification.date)}{" "}
                        {notification.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[90px] w-full items-center justify-center rounded-[10px] bg-white text-body-m-16 text-gray-01">
                  완료된 알림이 없습니다.
                </div>
              )}
            </section>
          </div>
        </div>

        <RepairAlarmCreateModal
          open={isAlarmModalOpen}
          alarmTitle={alarmTitle}
          alarmDate={alarmDate}
          isSubmitting={isAlarmSubmitting}
          onChangeAlarmTitle={setAlarmTitle}
          onChangeAlarmDate={setAlarmDate}
          onClose={handleCloseAlarmModal}
          onSubmit={handleSubmitAlarm}
        />

        <ProductNotificationModal
          open={!!selectedNotification}
          title={selectedNotification?.title ?? ""}
          date={selectedNotification?.date ?? ""}
          status={selectedNotification?.status ?? "진행중"}
          onClose={handleCloseDetailModal}
          onComplete={handleOpenCompleteModal}
          onEdit={handleEditNotification}
          onDelete={isDeleteSubmitting ? undefined : handleDeleteNotification}
        />

        <ProductNotificationEditModal
          open={isEditModalOpen}
          alarmTitle={editAlarmTitle}
          alarmDate={editAlarmDate}
          isSubmitting={isEditSubmitting}
          onChangeAlarmTitle={setEditAlarmTitle}
          onChangeAlarmDate={setEditAlarmDate}
          onClose={handleCloseEditModal}
          onSubmit={handleSubmitEditNotification}
        />

        <ProductNotificationCompleteModal
          open={isCompleteModalOpen}
          title={selectedNotification?.title ?? ""}
          date={selectedNotification?.date ?? ""}
          completeDate={completeDate}
          onChangeCompleteDate={setCompleteDate}
          onClose={handleCloseCompleteModal}
          onCompleteOnly={handleCompleteOnlyNotification}
          onRepairHistoryRegister={handleRepairHistoryRegister}
        />
      </div>
    </SecondLayout>
  );
}