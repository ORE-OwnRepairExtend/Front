type ChatHistory = {
  chatId: string;
  title: string;
  createdAt: string;
};

const mockChatHistories: ChatHistory[] = [
  {
    chatId: "1",
    title: "카메라 보증기간 문의",
    createdAt: "2026.06.07",
  },
  {
    chatId: "2",
    title: "노트북 수리 비용 질문",
    createdAt: "2026.06.06",
  },
  {
    chatId: "3",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "4",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "5",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "6",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "7",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "8",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "9",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
  {
    chatId: "10",
    title: "전자제품 관리 방법",
    createdAt: "2026.06.05",
  },
];

export default function ChatHistoryCard() {
  return (
    <div className="flex max-h-[430px] w-[230px] flex-col rounded-[24px] bg-neutral-04 px-[20px] py-[24px]">
      <h2 className="mb-[18px] shrink-0 text-[18px] font-semibold text-gray-01">
        지난 채팅
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto pr-[4px] no-scrollbar">
        <div className="flex flex-col gap-[12px]">
          {mockChatHistories.map((chat) => (
            <button
              key={chat.chatId}
              type="button"
              className="rounded-[14px] bg-white px-[14px] py-[12px] text-left"
              onClick={() => console.log(chat.chatId)}
            >
              <p className="line-clamp-1 text-[14px] font-medium text-gray-01">
                {chat.title}
              </p>
              <p className="mt-[4px] text-[12px] text-gray-02">
                {chat.createdAt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}