import type { ReactNode } from "react";
import type { ProductStatus } from "../../types/product";

// 알림에서는 valid 상태를 사용하지 않기 때문에 제외
type NotificationStatus =
  | Exclude<ProductStatus, "valid" | "empty">
  | "family";

type NotificationCardProps = {
  title: string;
  subtitle?: string;
  message: string;
  date: string;
  isRead?: boolean;
  status?: NotificationStatus;
  onClick?: () => void; // 추가
  children?: ReactNode;
  emphasizedText?: string;
};

// 상태별 UI 설정
const statusConfig: Record<NotificationStatus, { dotColor: string }> = {
  expired: {
    dotColor: "bg-gray-400",
  },
  danger: {
    dotColor: "bg-red-500",
  },
  imminent: {
    dotColor: "bg-[#D2D53A]",
  },
  family: {
    dotColor: "bg-primary-01",
  },
};

// 메시지 내 특정 키워드 강조 함수
function highlightStatus(text: string, emphasizedText?: string) {
  const keywords = ["만료", "위험", "임박", emphasizedText]
    .filter((keyword): keyword is string => Boolean(keyword));

  const escapedKeywords = [...new Set(keywords)].map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );

  return text
    .split(new RegExp(`(${escapedKeywords.join("|")})`, "g"))
    .map((part, idx) =>
      keywords.includes(part) ? (
        <strong key={idx} className="font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
}

export default function NotificationCard({
  title,
  subtitle,
  message,
  date,
  isRead = false,
  status = "imminent",
  onClick,
  children,
  emphasizedText,
}: NotificationCardProps) {
  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-[16px]
        rounded-[16px]
        px-[20px] py-[16px]
        transition-colors duration-200
        bg-neutral-01
        ${onClick ? "cursor-pointer hover:bg-gray-100" : ""}
      `}
    >
      {/* 상태 점 */}
      <div
        className={`
          h-[20px] w-[20px] shrink-0 rounded-full
          ${config.dotColor}
        `}
      />

      {/* 내용 */}
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <div className="flex flex-wrap items-start justify-between gap-[8px]">
          <div className="flex min-w-0 flex-wrap items-center gap-[8px]">
            <span className="text-title-b-20 text-primary-01">
              {title}
            </span>

            {subtitle && (
              <span className="text-body-r-12 text-gray-500 text-sm">
                {subtitle}
              </span>
            )}
          </div>

          <span className="text-body-r-12 text-sm whitespace-nowrap flex items-center gap-[4px]">
            <span className={isRead ? "text-gray-400" : "text-black font-bold"}>
              {isRead ? "읽음" : "안읽음"}
            </span>
            <span className="text-body-r-12 text-gray-400">· {date}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-[12px]">
          <p className="min-w-0 flex-1 break-words text-body-r-12 text-sm leading-[1.4]">
            {highlightStatus(message, emphasizedText)}
          </p>

          {children && (
            <div
              className="ml-auto flex shrink-0 items-center gap-[10px]"
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}