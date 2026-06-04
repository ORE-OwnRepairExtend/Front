import notificationIcon from "../../assets/icons/notification.svg";

type NotificationButtonProps = {
  hasUnread?: boolean;
  unreadCount?: number;
  onClick?: () => void;
};

export default function NotificationButton({
  hasUnread = false,
  unreadCount = 0,
  onClick,
}: NotificationButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative
        w-[45px] h-[45px]
        rounded-[10px]
        bg-secondary-02
        flex items-center justify-center
        cursor-pointer
      "
    >
      {/* 아이콘 */}
      <div>
        <img src={notificationIcon} alt="알림" width={30} height={30} />
      </div>

      {/* 빨간점 */}
      {hasUnread && (
        <span
          className="
            absolute
            top-[-6px] right-[-6px]
            flex h-[18px] min-w-[18px]
            items-center justify-center
            rounded-full
            bg-point-01
            px-[5px]
            text-[10px] font-bold text-white
          "
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}