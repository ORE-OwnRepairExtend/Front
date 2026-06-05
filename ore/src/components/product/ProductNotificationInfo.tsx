import { useRef, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import ProductNotificationCard from "./ProductNotificationCard";

type NotificationStatus = "진행중" | "완료";

type ProductNotification = {
  notificationId: string;
  title: string;
  date: string;
  status: NotificationStatus;
};

type ProductNotificationInfoProps = {
  notifications: ProductNotification[];
  onRegisterClick?: () => void;
};

function formatNotificationDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return formatDate(parsedDate);
}

export default function ProductNotificationInfo({
  notifications,
  onRegisterClick,
}: ProductNotificationInfoProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;

    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <section className="flex w-full flex-col items-start gap-[10px] px-[10px]">
      <div className="flex w-full items-center justify-between">
        <h3 className="flex items-center text-body-sb-20 text-primary-01">
          알림 정보
        </h3>

        <button
          type="button"
          onClick={onRegisterClick}
          className="flex items-center gap-[10px] text-body-m-16 text-black"
        >
          등록하기
          <span>{">"}</span>
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-[30px] bg-white/50 px-[22px] py-[18px]">
        {notifications.length > 0 ? (
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
            <div className="flex w-max items-center gap-[14px]">
              {notifications.map((notification) => (
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
            등록된 알림이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}