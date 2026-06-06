import { useRef, useState, type MouseEvent } from "react";
import { formatDate } from "../../utils/formatDate";
import ProductNotificationCard from "./ProductNotificationCard";

import forwardBlackIcon from "../../assets/icons/forword_black.svg";

type NotificationStatus = "진행중" | "완료";

type ProductNotification = {
  notificationId: string;
  productId: string;
  productName: string;
  title: string;
  date: string;
  status: NotificationStatus;
};

type ProductNotificationInfoProps = {
  notifications: ProductNotification[];
  onRegisterClick?: () => void;
  onNotificationClick?: (notification: ProductNotification) => void;
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
  onNotificationClick,
}: ProductNotificationInfoProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isMovedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handleCardClick = (notification: ProductNotification) => {
    if (isMovedRef.current) {
      isMovedRef.current = false;
      return;
    }

    onNotificationClick?.(notification);
  };

  return (
    <section className="flex w-full flex-col gap-[20px] rounded-[30px] bg-white/50 px-[40px] py-[30px]">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-title-main text-primary-02">예정된 알림</h2>

        <button
          type="button"
          onClick={onRegisterClick}
          className="flex cursor-pointer items-center gap-[15px] text-body-m-16"
        >
          등록하기
          <img src={forwardBlackIcon} alt="알림 등록하기" height={24} />
        </button>
      </div>

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
          <div className="flex w-max items-center gap-[20px]">
            {notifications.map((notification) => (
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
    </section>
  );
}