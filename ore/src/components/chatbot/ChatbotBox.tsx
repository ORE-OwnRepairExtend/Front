import { useEffect, useState } from "react";
import chatPlusIcon from "../../assets/chat_plus.svg";
import sendIcon from "../../assets/send.svg";
import { api } from "../../api/api";
import type { ApiProductCategory } from "../../types/category";

type ChatMessage = {
  id: number;
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
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    null,
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      text: "안녕하세요! 오래의 AI 챗봇입니다.\n무엇을 도와드릴까요?",
    },
  ]);

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

  const handleProductClick = (product: ProductOption) => {
    setSelectedProduct(product);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: product.label,
      },
    ]);

    // todo: 선택한 제품 기준으로 채팅 세션 생성 API 호출
    console.log("선택한 제품:", product);
  };

  const handleEtcClick = () => {
    setSelectedProduct(null);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: "기타 질문",
      },
    ]);

    // todo: 기타 질문 모드 처리
    console.log("기타 질문 선택");
  };

  const handleNewProductQuestionClick = () => {
    setSelectedProduct(null);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "bot",
        text: "새로 질문할 제품을 선택해주세요.",
      },
    ]);

    // todo: 다른 제품 질문하기 클릭 시 새 채팅 세션 생성 또는 제품 재선택 처리
    console.log("새 제품 질문하기 클릭");
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

          {messages.map((message) => (
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
                    onClick={() => handleProductClick(product)}
                    className="
                      rounded-full border border-primary-01
                      px-[20px] py-[8px]
                      text-body-r-12 text-primary-01
                      transition hover:bg-primary-01 hover:text-white
                    "
                  >
                    {product.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleEtcClick}
                  className="
                    rounded-full border border-primary-01
                    px-[20px] py-[8px]
                    text-body-r-12 text-primary-01
                    transition hover:bg-primary-01 hover:text-white
                  "
                >
                  기타 질문
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 다른 제품 질문하기 버튼 */}
      {selectedProduct && (
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