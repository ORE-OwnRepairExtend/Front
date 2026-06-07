type ChatSession = {
  sessionId: string;
  productId: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
};

const mockChatSessions: ChatSession[] = [
  {
    sessionId: "1",
    productId: "product-1",
    lastMessage: "필터 청소는 먼저 전원을 끄고 진행해주세요.",
    lastMessageAt: "2026-03-24T12:10:00",
    createdAt: "2026-03-24T12:00:00",
  },
  {
    sessionId: "2",
    productId: "product-2",
    lastMessage: null,
    lastMessageAt: null,
    createdAt: "2026-03-24T12:00:00",
  },
  {
    sessionId: "3",
    productId: "product-3",
    lastMessage: "서비스센터 방문 전 보증기간을 먼저 확인해주세요.",
    lastMessageAt: "2026-03-23T16:30:00",
    createdAt: "2026-03-23T16:00:00",
  },
  {
    sessionId: "4",
    productId: "product-4",
    lastMessage: "수리 이력이 있다면 이전 증상과 비교해보는 것이 좋아요.",
    lastMessageAt: "2026-03-22T09:20:00",
    createdAt: "2026-03-22T09:00:00",
  },
];

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
  return (
    <div className="flex max-h-[430px] w-[230px] flex-col rounded-[24px] bg-neutral-04 px-[20px] py-[24px]">
      <h2 className="mb-[18px] shrink-0 text-[18px] font-semibold text-gray-01">
        지난 채팅
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto pr-[4px] no-scrollbar">
        <div className="flex flex-col gap-[12px]">
          {mockChatSessions.map((chat) => (
            <button
              key={chat.sessionId}
              type="button"
              className="rounded-[14px] bg-white px-[14px] py-[12px] text-left"
              onClick={() => console.log(chat.sessionId)}
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
      </div>
    </div>
  );
}