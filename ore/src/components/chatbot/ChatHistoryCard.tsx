import { useEffect, useState } from "react";
import { api } from "../../api/api";

type ChatSession = {
  sessionId: string;
  productId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
};

function formatChatDate(date: string | null) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

export default function ChatHistoryCard() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatSessions = async () => {
    try {
      setIsLoading(true);

      const response = await api.get<ChatSession[]>("/chat/sessions");

      setChatSessions(response.data);
    } catch (error) {
      console.error("채팅 세션 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

  useEffect(() => {
    const handleChatSessionRefresh = () => {
      fetchChatSessions();
    };

    window.addEventListener("chat-session-refresh", handleChatSessionRefresh);

    return () => {
      window.removeEventListener(
        "chat-session-refresh",
        handleChatSessionRefresh,
      );
    };
  }, []);

  const handleSessionClick = (chat: ChatSession) => {
    window.dispatchEvent(
      new CustomEvent("chat-session-select", {
        detail: {
          sessionId: chat.sessionId,
          productId: chat.productId,
        },
      }),
    );
  };

  return (
    <div className="flex max-h-[430px] w-[230px] flex-col rounded-[24px] bg-neutral-04 px-[20px] py-[24px]">
      <h2 className="mb-[18px] shrink-0 text-[18px] font-semibold text-gray-01">
        지난 채팅
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto pr-[4px] no-scrollbar">
        {isLoading ? (
          <p className="text-[13px] text-gray-02">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {chatSessions.map((chat) => (
              <button
                key={chat.sessionId}
                type="button"
                className="rounded-[14px] bg-white px-[14px] py-[12px] text-left"
                onClick={() => handleSessionClick(chat)}
              >
                <p className="line-clamp-2 text-[14px] font-medium text-gray-01">
                  {chat.lastMessage ?? "아직 메시지가 없습니다."}
                </p>

                <p className="mt-[6px] text-[12px] text-gray-02">
                  {formatChatDate(chat.lastMessageAt ?? chat.createdAt)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}