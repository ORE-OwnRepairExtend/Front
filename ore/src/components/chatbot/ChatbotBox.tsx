import chatPlusIcon from "../../assets/chat_plus.svg";
import sendIcon from "../../assets/send.svg";

type ChatMessage = {
  id: number;
  type: "bot" | "user";
  text: string;
};

const chatMessages: ChatMessage[] = [
  {
    id: 1,
    type: "bot",
    text: "안녕하세요! 오래의 AI 챗봇입니다.\n무엇을 도와드릴까요?",
  },
  {
    id: 2,
    type: "user",
    text: "제품의 서비스센터 정보를 알고 싶어요",
  },
  {
    id: 3,
    type: "user",
    text: "제품의 서비스센터 정보를 알고 싶어요",
  },
  {
    id: 4,
    type: "bot",
    text: "안녕하세요! 오래의 AI 챗봇입니다.\n무엇을 도와드릴까요?",
  },
  {
    id: 5,
    type: "bot",
    text: "안녕하세요! 오래의 AI 챗봇입니다.\n무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?",
  },
  {
    id: 6,
    type: "user",
    text: "제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요제품의 서비스센터 정보를 알고 싶어요",
  },
];

const quickMenus = [
  "자주 찾는 질문",
  "내 제품 조회",
  "내 제품 조회",
  "내 제품 조회",
  "내 제품 조회",
];

function renderBotMessage(text: string) {
  const parts = text.split("오래");

  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && (
        <span className="text-primary-01">오래</span>
      )}
    </span>
  ));
}

export default function ChatbotBox() {
  return (
    <section
      className="
        flex h-full min-h-0 flex-col
        rounded-[30px] bg-secondary-01/40
        px-[45px] py-[25px]
      "
    >
      {/* 날짜 구분선 */}
      <div className="mb-[20px] flex items-center justify-center">
        <div className="h-0 flex-1 border-t-2 border-dashed border-primary-01" />
        <span
          className="
            mx-[8px] rounded-[100px]
            bg-primary-01 px-[12px] py-[6px]
            text-body-sb-12 text-white
          "
        >
          Sat 03/14
        </span>
        <div className="h-0 flex-1 border-t-2 border-dashed border-primary-01" />
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-[5px] no-scrollbar">
        <div className="flex flex-col gap-[18px]">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`
                flex items-start gap-[15px]
                ${message.type === "user" ? "justify-end" : "justify-start"}
              `}
            >
              {message.type === "bot" && (
                <div className="mt-[3px] h-[28px] w-[28px] shrink-0 rounded-full bg-gray-02" />
              )}

              <div
                className="
                  max-w-[420px] whitespace-pre-line rounded-[8px]
                  bg-white px-[18px] py-[12px]
                  text-body-m-10 text-black
                "
              >
                {message.type === "bot"
                  ? renderBotMessage(message.text)
                  : message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 빠른 질문 버튼 */}
      <div className="mt-[15px] flex shrink-0 flex-wrap gap-[10px]">
        {quickMenus.map((menu, index) => (
          <button
            key={`${menu}-${index}`}
            type="button"
            className="
              rounded-full bg-white px-[22px] py-[7px]
              text-body-r-12 text-primary-01
              hover:bg-neutral-01 transition
            "
          >
            {menu}
          </button>
        ))}
      </div>

      {/* 입력창 */}
      <div
        className="
          mt-[12px] flex h-[48px] shrink-0 items-center gap-[10px]
          rounded-[10px] border-2 border-primary-01
          bg-white px-[10px]
        "
      >
        <button
          type="button"
          className="
            flex h-[32px] w-[32px] shrink-0 items-center justify-center
            rounded-[8px] bg-secondary-01
            cursor-pointer
          "
        >
          <img
            src={chatPlusIcon}
            alt="파일 추가"
            className="h-[18px] w-[18px]"
          />
        </button>

        <input
          type="text"
          className="
            flex-1 bg-transparent
            text-body-r-12 text-black
            outline-none
            placeholder:text-gray-01
          "
        />

        <button
          type="button"
          className="
            flex h-[34px] w-[34px] shrink-0 items-center justify-center
            rounded-[9px] bg-primary-01
            cursor-pointer
          "
        >
          <img src={sendIcon} alt="보내기" className="h-[18px] w-[18px]" />
        </button>
      </div>
    </section>
  );
}