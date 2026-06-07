import { type KeyboardEvent, useEffect, useState } from "react";
import chatPlusIcon from "../../assets/chat_plus.svg";
import sendIcon from "../../assets/send.svg";
import { api } from "../../api/api";
import type { ApiProductCategory } from "../../types/category";

type ChatMessage = {
  id: string;
  type: "bot" | "user";
  text: string;
};

type ProductListResponse = {
  productId: string;
  name: string;
  nickname: string;
  category: ApiProductCategory;
  imageUrl: string;
  isFavorite: boolean;
  hasRepairHistory: boolean;
  purchaseDate: string;
  remainingDays: number | null;
  createdAt: string;
};

type ProductOption = {
  productId: string;
  label: string;
};

type ChatSessionResponse = {
  sessionId: string;
  productId: string | null;
  createdAt: string;
};

type ChatMessageResponse = {
  messageId: string;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
};

type SendMessageResponse = {
  userMessage: ChatMessageResponse;
  aiMessage: ChatMessageResponse;
};

type SelectedTarget =
  | {
      type: "product";
      productId: string;
      label: string;
    }
  | {
      type: "etc";
      productId: null;
      label: string;
    };

type ChatSessionSelectEventDetail = {
  sessionId: string;
  productId: string | null;
};

const initialMessages: ChatMessage[] = [
  {
    id: "initial-1",
    type: "bot",
    text: "안녕하세요! 오래의 AI 챗봇입니다.\n무엇을 도와드릴까요?",
  },
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

function mapChatMessage(message: ChatMessageResponse): ChatMessage {
  return {
    id: message.messageId,
    type: message.role === "USER" ? "user" : "bot",
    text: message.content,
  };
}

export default function ChatbotBox() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(
    null,
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const isChatDisabled =
    selectedTarget === null ||
    sessionId === null ||
    isLoadingMessages ||
    isSendingMessage;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<ProductListResponse[]>("/products");

        const mappedProducts: ProductOption[] = response.data.map((product) => ({
          productId: product.productId,
          label: product.nickname || product.name,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("제품 목록 조회 실패:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleSessionSelect = async (event: Event) => {
      const customEvent = event as CustomEvent<ChatSessionSelectEventDetail>;
      const { sessionId: selectedSessionId, productId } = customEvent.detail;

      await fetchChatMessages(selectedSessionId, productId);
    };

    window.addEventListener("chat-session-select", handleSessionSelect);

    return () => {
      window.removeEventListener("chat-session-select", handleSessionSelect);
    };
  }, []);

  const createChatSession = async (productId: string | null) => {
    const response = await api.post<ChatSessionResponse>("/chat/sessions", {
      productId,
    });

    return response.data;
  };

  const refreshChatSessions = () => {
    window.dispatchEvent(new Event("chat-session-refresh"));
  };

  const fetchChatMessages = async (
    selectedSessionId: string,
    productId: string | null,
  ) => {
    try {
      setIsLoadingMessages(true);

      const response = await api.get<ChatMessageResponse[]>(
        `/chat/sessions/${selectedSessionId}/messages`,
      );

      const mappedMessages = response.data.map(mapChatMessage);

      setSessionId(selectedSessionId);
      setInputValue("");

      setSelectedTarget(
        productId
          ? {
              type: "product",
              productId,
              label: "제품 질문",
            }
          : {
              type: "etc",
              productId: null,
              label: "기타 질문",
            },
      );

      setMessages(mappedMessages.length > 0 ? mappedMessages : initialMessages);
    } catch (error) {
      console.error("채팅 메시지 조회 실패:", error);

      setMessages([
        ...initialMessages,
        {
          id: `error-${Date.now()}`,
          type: "bot",
          text: "채팅 메시지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleProductClick = async (product: ProductOption) => {
    if (isCreatingSession) return;

    try {
      setIsCreatingSession(true);

      const session = await createChatSession(product.productId);

      setSessionId(session.sessionId);
      refreshChatSessions();

      setSelectedTarget({
        type: "product",
        productId: product.productId,
        label: product.label,
      });

      setInputValue("");

      setMessages([
        ...initialMessages,
        {
          id: `user-${Date.now()}`,
          type: "user",
          text: product.label,
        },
        {
          id: `bot-${Date.now() + 1}`,
          type: "bot",
          text: `${product.label}에 대해 궁금한 점을 입력해주세요.`,
        },
      ]);
    } catch (error) {
      console.error("채팅 세션 생성 실패:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "bot",
          text: "채팅 세션을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleEtcClick = async () => {
    if (isCreatingSession) return;

    try {
      setIsCreatingSession(true);

      const session = await createChatSession(null);

      setSessionId(session.sessionId);
      refreshChatSessions();

      setSelectedTarget({
        type: "etc",
        productId: null,
        label: "기타 질문",
      });

      setInputValue("");

      setMessages([
        ...initialMessages,
        {
          id: `user-${Date.now()}`,
          type: "user",
          text: "기타 질문",
        },
        {
          id: `bot-${Date.now() + 1}`,
          type: "bot",
          text: "제품 외에 궁금한 점을 입력해주세요.",
        },
      ]);
    } catch (error) {
      console.error("채팅 세션 생성 실패:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "bot",
          text: "채팅 세션을 생성하지 못했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleNewProductQuestionClick = () => {
    setSelectedTarget(null);
    setSessionId(null);
    setInputValue("");
    setMessages(initialMessages);
  };

  const handleSendClick = async () => {
    const trimmedValue = inputValue.trim();

    if (!selectedTarget || !sessionId || !trimmedValue || isSendingMessage) {
      return;
    }

    try {
      setIsSendingMessage(true);
      setInputValue("");

      const response = await api.post<SendMessageResponse>(
        `/chat/sessions/${sessionId}/messages`,
        {
          message: trimmedValue,
        },
      );

      const newMessages: ChatMessage[] = [
        mapChatMessage(response.data.userMessage),
        mapChatMessage(response.data.aiMessage),
      ];

      setMessages((prev) => [...prev, ...newMessages]);

      refreshChatSessions();
    } catch (error) {
      console.error("메시지 전송 실패:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          type: "user",
          text: trimmedValue,
        },
        {
          id: `error-${Date.now() + 1}`,
          type: "bot",
          text: "메시지를 전송하지 못했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    handleSendClick();
  };

  return (
    <section
      className="
        flex h-full min-h-0 flex-col
        rounded-[30px] bg-secondary-01/40
        px-[45px] py-[25px]
      "
    >
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-[5px] no-scrollbar">
        <div className="flex flex-col gap-[18px]">
          {/* 날짜 구분선 */}
          <div className="mb-[2px] flex items-center justify-center">
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

          {isLoadingMessages && (
            <div className="flex items-start gap-[15px] justify-start">
              <div className="mt-[3px] h-[28px] w-[28px] shrink-0 rounded-full bg-gray-02" />

              <div
                className="
                  max-w-[420px] whitespace-pre-line rounded-[8px]
                  bg-white px-[18px] py-[12px]
                  text-body-m-10 text-black
                "
              >
                메시지를 불러오는 중입니다.
              </div>
            </div>
          )}

          {!isLoadingMessages &&
            messages.map((message) => (
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

          {/* 제품 선택 메시지 */}
          {!selectedTarget && !isLoadingMessages && (
            <div className="flex items-start gap-[15px] justify-start">
              <div className="mt-[3px] h-[28px] w-[28px] shrink-0 rounded-full bg-gray-02" />

              <div
                className="
                  max-w-[420px] rounded-[20px]
                  bg-white px-[22px] py-[20px]
                  text-black
                "
              >
                <p className="mb-[14px] text-body-m-12">
                  원하는 제품을 선택해주세요.
                </p>

                <div className="flex flex-wrap gap-[10px]">
                  {products.map((product) => (
                    <button
                      key={product.productId}
                      type="button"
                      disabled={isCreatingSession}
                      onClick={() => handleProductClick(product)}
                      className="
                        rounded-full border-2 border-primary-01
                        px-[20px] py-[8px]
                        text-body-r-12 text-primary-01
                        transition hover:bg-primary-01 hover:text-white
                        disabled:cursor-not-allowed disabled:opacity-50
                      "
                    >
                      {product.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={isCreatingSession}
                    onClick={handleEtcClick}
                    className="
                      rounded-full border-2 border-primary-01
                      px-[20px] py-[8px]
                      text-body-r-12 text-primary-01
                      transition hover:bg-primary-01 hover:text-white
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    기타 질문
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 다른 제품 질문하기 버튼 */}
      {selectedTarget && (
        <div className="mt-[12px] flex shrink-0 justify-end">
          <button
            type="button"
            onClick={handleNewProductQuestionClick}
            className="
              rounded-full bg-white px-[18px] py-[8px]
              border-2 border-primary-01
              text-body-r-12 text-primary-01
              transition hover:bg-primary-01 hover:text-white
            "
          >
            다른 제품 질문하기
          </button>
        </div>
      )}

      {/* 입력창 */}
      <div
        className={`
          mt-[12px] flex h-[48px] shrink-0 items-center gap-[10px]
          rounded-[10px] border-2 border-primary-01
          bg-white px-[10px]
          ${isChatDisabled ? "opacity-60" : ""}
        `}
      >
        <button
          type="button"
          disabled={isChatDisabled}
          className="
            flex h-[32px] w-[32px] shrink-0 items-center justify-center
            rounded-[8px] bg-secondary-01
            cursor-pointer disabled:cursor-not-allowed
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
          value={inputValue}
          disabled={isChatDisabled}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={
            isChatDisabled
              ? "먼저 제품을 선택해주세요."
              : "궁금한 내용을 입력해주세요."
          }
          className="
            flex-1 bg-transparent
            text-body-r-12 text-black
            outline-none
            placeholder:text-gray-01
            disabled:cursor-not-allowed
          "
        />

        <button
          type="button"
          disabled={
            isChatDisabled || inputValue.trim().length === 0 || isSendingMessage
          }
          onClick={handleSendClick}
          className="
            flex h-[34px] w-[34px] shrink-0 items-center justify-center
            rounded-[9px] bg-primary-01
            cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <img src={sendIcon} alt="보내기" className="h-[18px] w-[18px]" />
        </button>
      </div>
    </section>
  );
}