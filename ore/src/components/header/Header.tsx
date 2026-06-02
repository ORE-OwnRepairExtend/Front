import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";
import { useNotificationStore } from "../../store/notificationStore";

import closeIcon from "../../assets/icons/close.svg";

type HeaderProps = {
  title: string;
  subtitle?: string;
  isMain?: boolean;

  showSearch?: boolean;
  searchValue?: string;

  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;

  showNotification?: boolean;

  showCloseButton?: boolean;
};

export default function Header({
  title,
  subtitle,
  isMain = false,
  showSearch = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showNotification = true,
  showCloseButton = false,
}: HeaderProps) {
  const navigate = useNavigate();

  // Zustand 연결
  const { notifications } = useNotificationStore();

  // 안 읽은 알림 여부 계산
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <header
      className="
        flex w-full flex-col items-start gap-[10px]
        pb-[10px]
      "
    >
      <div className="flex w-full min-h-[45px] items-end justify-between">
        {/* 왼쪽 영역 */}
        {isMain ? (
          <div className="flex flex-col items-start gap-[3px]">
            <h1 className="text-title-main text-primary-02">{title}</h1>
            {subtitle && (
              <p className="text-body-r-12 text-gray-01">{subtitle}</p>
            )}
          </div>
        ) : (
          <h1 className="text-title-main text-primary-02">{title}</h1>
        )}

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-[20px]">
          {showSearch && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              onSubmit={onSearchSubmit}
            />
          )}

          {showCloseButton ? (
            <button
              type="button"
              onClick={() => navigate("/products/")}
              className="cursor-pointer"
            >
              <img src={closeIcon} alt="닫기" className="h-[30px] w-[30px]" />
            </button>
          ) : (
            showNotification && (
              <NotificationButton
                hasUnread={hasUnread}
                onClick={() => navigate("/notifications")}
              />
            )
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div
        className={`
          h-0 w-full border-t-2
          ${isMain ? "border-transparent" : "border-gray-02"}
        `}
      />
    </header>
  );
}
