import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SecondLayout from "../../layout/SecondLayout";
import Header from "../../components/header/Header";
import ProductNotificationCard from "../../components/product/ProductNotificationCard";
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
    status: "완료",
  },
  {
    notificationId: "7",
    title: "렌즈 수리",
    date: "2026.06.04",
    status: "완료",
  },
  {
    notificationId: "8",
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

export default function ProductNotificationPage() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [notifications, setNotifications] = useState<ProductNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  const handleRegisterClick = () => {
    if (!productId) return;

    navigate(`/products/${productId}/notifications/new`);
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
                <div className="w-full overflow-x-auto no-scrollbar">
                  <div className="flex w-max items-center gap-[20px]">
                    {scheduledNotifications.map((notification) => (
                      <ProductNotificationCard
                        key={notification.notificationId}
                        title={notification.title}
                        date={formatNotificationDate(notification.date)}
                        status={notification.status}
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
                      className="flex w-full items-center rounded-[10px] bg-white px-[18px] py-[10px]"
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
      </div>
    </SecondLayout>
  );
}