import SearchBar from "./SearchBar";
import NotificationButton from "./NotificationButton";

type HeaderProps = {
  title: string;
  subtitle?: string;
  isMain?: boolean;

  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;

  showNotification?: boolean;
  hasUnreadNotification?: boolean;
  onNotificationClick?: () => void;
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
  hasUnreadNotification = false,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header
      className="
        flex w-full flex-col items-start gap-[10px]
        pb-[10px]
      "
    >
      <div className="flex w-full items-end justify-between">
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

          {showNotification && (
            <NotificationButton
              hasUnread={hasUnreadNotification}
              onClick={onNotificationClick}
            />
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
