import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductNotificationCard from "../../components/product/ProductNotificationCard";
import ProductNotificationModal from "../../components/product/ProductNotificationModal";
import ProductNotificationEditModal from "../../components/product/ProductNotificationEditModal";
import ProductNotificationCompleteModal from "../../components/product/ProductNotificationCompleteModal";
import RepairAlarmCreateModal from "../../components/repair/RepairAlarmCreateModal";
import { formatDate } from "../../utils/formatDate";

type NotificationStatus = "진행중" | "완료";

type ProductNotification = {
  notificationId: string;
  title: string;
  date: string;
  status: NotificationStatus;
};

const mockNotifications: ProductNotification[] = [
  {
    notificationId: "1",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "2",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "3",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "4",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "5",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "6",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "7",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "진행중",
  },
  {
    notificationId: "8",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "완료",
  },
  {
    notificationId: "9",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "완료",
  },
  {
    notificationId: "10",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "완료",
  },
  {
    notificationId: "11",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "완료",
  },
];

function formatNotificationDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return formatDate(parsedDate);
}

function toDateInputValue(date: string) {
  return date.replaceAll(".", "-");
}

export default function ProductNotificationPage() {
  const { productId } = useParams();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isMovedRef = useRef(false);

  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage] = useState("");

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [alarmTitle, setAlarmTitle] = useState("");
  const [alarmDate, setAlarmDate] = useState("");

  const [selectedNotification, setSelectedNotification] =
    useState<ProductNotification | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAlarmTitle, setEditAlarmTitle] = useState("");
  const [editAlarmDate, setEditAlarmDate] = useState("");

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completeDate, setCompleteDate] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

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
    setIsAlarmModalOpen(false);
    setAlarmTitle("");
    setAlarmDate("");
  };

  const handleSubmitAlarm = () => {
    if (!productId) return;

    if (!alarmTitle.trim() || !alarmDate) {
      alert("알림 이름과 알림 날짜를 입력해주세요.");
      return;
    }

    const newNotification: ProductNotification = {
      notificationId: String(Date.now()),
      title: alarmTitle,
      date: alarmDate,
      status: "진행중",
    };

    setNotifications((prev) => [newNotification, ...prev]);
    handleCloseAlarmModal();
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
    setIsCompleteModalOpen(false);
    setCompleteDate("");
  };

  const handleCompleteOnlyNotification = () => {
    if (!selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    const completedNotification: ProductNotification = {
      ...selectedNotification,
      status: "완료",
    };

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === selectedNotification.notificationId
          ? completedNotification
          : notification,
      ),
    );

    setSelectedNotification(null);
    handleCloseCompleteModal();
  };

  const handleRepairHistoryRegister = () => {
    if (!selectedNotification) return;

    if (!completeDate.trim()) {
      alert("완료 날짜를 입력해주세요.");
      return;
    }

    const completedNotification: ProductNotification = {
      ...selectedNotification,
      status: "완료",
    };

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === selectedNotification.notificationId
          ? completedNotification
          : notification,
      ),
    );

    setSelectedNotification(null);
    handleCloseCompleteModal();

    console.log("수리 이력 등록하기");
  };

  const handleEditNotification = () => {
    if (!selectedNotification) return;

    setEditAlarmTitle("");
    setEditAlarmDate("");
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditAlarmTitle("");
    setEditAlarmDate("");
  };

  const handleSubmitEditNotification = () => {
    if (!selectedNotification) return;

    if (!editAlarmTitle.trim() || !editAlarmDate) {
      alert("알림 이름과 알림 날짜를 입력해주세요.");
      return;
    }

    const editedNotification: ProductNotification = {
      ...selectedNotification,
      title: editAlarmTitle,
      date: editAlarmDate,
    };

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === selectedNotification.notificationId
          ? editedNotification
          : notification,
      ),
    );

    setSelectedNotification(editedNotification);
    handleCloseEditModal();
  };

  const handleDeleteNotification = () => {
    if (!selectedNotification) return;

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.notificationId !== selectedNotification.notificationId,
      ),
    );

    setSelectedNotification(null);
  };

  const scheduledNotifications = notifications.filter(
    (notification) => notification.status === "진행중",
  );

  const completedNotifications = notifications.filter(
    (notification) => notification.status === "완료",
  );

  if (isLoading) {
    return (
      <SecondLayout>
        <div className="flex h-full flex-col">
          <Header title="Product" showNotification={false} showCloseButton />
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
          onDelete={handleDeleteNotification}
        />

        <ProductNotificationEditModal
          open={isEditModalOpen}
          alarmTitle={editAlarmTitle}
          alarmDate={editAlarmDate}
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