import notificationIcon from "../../assets/icons/notification.svg";

type NotificationButtonProps = {
  hasUnread?: boolean;
  onClick?: () => void;
};

export default function NotificationButton({
  hasUnread = false,
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
            top-[-2px] right-[-2px]
            w-[10px] h-[10px]
            rounded-full
            bg-point-01
          "
        />
      )}
    </button>
  );
}
