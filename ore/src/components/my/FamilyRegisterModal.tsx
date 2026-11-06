import { useEffect, useRef, useState } from "react";
import { getFamilyErrorMessage } from "../../api/family";
import closeIcon from "../../assets/icons/close.svg";

type FamilyRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequest: (
    recipientEmail: string,
    nickname: string,
  ) => Promise<void>;
};

export default function FamilyRegisterModal({
  isOpen,
  onClose,
  onRequest,
}: FamilyRegisterModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const requestingRef = useRef(false);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 모달을 다시 열 때 입력값 초기화
  useEffect(() => {
    if (!isOpen) return;

    setRecipientEmail("");
    setNickname("");
    setErrorMessage("");

    const previousFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    emailRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;

      if (previousFocusedElement instanceof HTMLElement) {
        previousFocusedElement.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (requestingRef.current) return;
    onClose();
  };

  // 가족 요청
  const handleRequest = async () => {
    if (requestingRef.current) return;

    const trimmedEmail = recipientEmail.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedEmail || !trimmedNickname) {
      setErrorMessage("이메일과 가족의 닉네임을 입력해주세요.");
      return;
    }

    try {
      requestingRef.current = true;
      setIsRequesting(true);
      setErrorMessage("");

      await onRequest(trimmedEmail, trimmedNickname);
      onClose();
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(
          error,
          "가족 초대 요청에 실패했습니다. 다시 시도해주세요.",
        ),
      );
    } finally {
      requestingRef.current = false;
      setIsRequesting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/20 p-[20px]
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          handleClose();
        }

        if (event.key !== "Tab") return;

        const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled])",
        );

        if (!elements?.length) return;

        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-register-title"
        aria-busy={isRequesting}
        className="
          relative flex w-[400px] max-w-full
          max-h-[calc(100dvh-40px)]
          flex-col overflow-y-auto
          rounded-[22px] bg-secondary-01
          px-[24px] pb-[30px] pt-[52px]
        "
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isRequesting}
          aria-label="가족 등록 닫기"
          className="
            absolute right-[24px] top-[18px]
            cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <img
            src={closeIcon}
            alt=""
            className="h-[24px] w-[24px]"
          />
        </button>

        {/* 제목 */}
        <h2
          id="family-register-title"
          className="text-center text-title-b-32 text-primary-01"
        >
          가족 등록
        </h2>

        {/* 폼 */}
        <form
          className="mt-[40px]"
          onSubmit={(event) => {
            event.preventDefault();
            void handleRequest();
          }}
        >
          <fieldset
            disabled={isRequesting}
            className="flex min-w-0 flex-col border-0 p-0"
          >
            {/* 아이디 */}
            <label
              htmlFor="family-recipient-email"
              className="mb-[8px] text-body-m-16 text-black"
            >
              아이디
            </label>

            <input
              ref={emailRef}
              id="family-recipient-email"
              type="email"
              autoComplete="email"
              required
              value={recipientEmail}
              onChange={(event) => {
                setRecipientEmail(event.target.value);
                setErrorMessage("");
              }}
              placeholder="초대할 사용자의 이메일을 입력해주세요."
              className="
                h-[38px] w-full
                rounded-[9px] border border-gray-02
                bg-white px-[14px]
                text-body-r-16 text-black
                outline-none placeholder:text-gray-01
                focus:border-primary-01
              "
            />

            {/* 닉네임 */}
            <label
              htmlFor="family-register-nickname"
              className="mb-[8px] mt-[24px] text-body-m-16 text-black"
            >
              닉네임
            </label>

            <input
              id="family-register-nickname"
              type="text"
              required
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setErrorMessage("");
              }}
              placeholder="가족의 닉네임을 설정해주세요."
              className="
                h-[38px] w-full
                rounded-[9px] border border-gray-02
                bg-white px-[14px]
                text-body-r-16 text-black
                outline-none placeholder:text-gray-01
                focus:border-primary-01
              "
            />

            <div className="min-h-[48px] pt-[8px]">
              {errorMessage && (
                <p role="alert" className="text-body-r-12 text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* 요청 버튼 */}
            <button
              type="submit"
              disabled={
                isRequesting ||
                !recipientEmail.trim() ||
                !nickname.trim()
              }
              className="
                mt-[20px]
                flex h-[48px] w-full
                items-center justify-center
                rounded-[14px] bg-primary-01
                text-button-b-20 text-white
                cursor-pointer transition-opacity
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {isRequesting ? "요청 중..." : "요청"}
            </button>

            <p className="mt-[8px] text-center text-body-m-16 text-gray-01">
              요청이 수락되면 가족으로 등록됩니다.
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
}