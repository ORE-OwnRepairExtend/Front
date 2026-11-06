import { useEffect, useRef, useState } from "react";
import { getFamilyErrorMessage } from "../../api/family";

import closeIcon from "../../assets/icons/close.svg";

type FamilyAcceptModalProps = {
  requesterName?: string;
  requesterEmail?: string;
  onClose: () => void;
  onAccept: (nickname: string) => Promise<void>;
  onReject: () => Promise<void>;
};

export default function FamilyAcceptModal({
  requesterName,
  requesterEmail,
  onClose,
  onAccept,
  onReject,
}: FamilyAcceptModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const [nickname, setNickname] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "accept" | "reject" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = pendingAction !== null;

  useEffect(() => {
    const previousFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    nicknameRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;

      if (
        previousFocusedElement instanceof HTMLElement &&
        previousFocusedElement.isConnected
      ) {
        previousFocusedElement.focus();
      }
    };
  }, []);

  const handleClose = () => {
    if (submittingRef.current) return;
    onClose();
  };

  const handleRespond = async (action: "accept" | "reject") => {
    if (submittingRef.current) return;

    const trimmedNickname = nickname.trim();

    if (action === "accept" && !trimmedNickname) {
      setErrorMessage("가족의 닉네임을 입력해주세요.");
      nicknameRef.current?.focus();
      return;
    }

    try {
      submittingRef.current = true;
      setPendingAction(action);
      setErrorMessage("");

      if (action === "accept") {
        await onAccept(trimmedNickname);
      } else {
        await onReject();
      }

      onClose();
    } catch (error) {
      setErrorMessage(
        getFamilyErrorMessage(
          error,
          "가족 요청을 처리하지 못했습니다. 다시 시도해주세요.",
        ),
      );
    } finally {
      submittingRef.current = false;
      setPendingAction(null);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gray-01/80 p-[20px]
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

        if (!elements?.length) {
          event.preventDefault();
          return;
        }

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
        aria-labelledby="family-accept-title"
        aria-describedby="family-accept-description"
        aria-busy={isSubmitting}
        className="
          relative flex w-[400px] max-w-full
          max-h-[calc(100dvh-40px)]
          flex-col overflow-y-auto
          rounded-[22px] bg-secondary-01
          px-[24px] pb-[40px] pt-[60px]
        "
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="가족 등록 닫기"
          className="
            absolute right-[24px] top-[24px]
            cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <img src={closeIcon} alt="" className="h-[24px] w-[24px]" />
        </button>

        {/* 제목 */}
        <h2
          id="family-accept-title"
          className="text-center text-title-b-32 text-primary-01"
        >
          가족 등록
        </h2>

        <p
          id="family-accept-description"
          className="mt-[20px] break-words text-center text-body-r-16 text-gray-01"
        >
          {requesterName ? (
            <>
              <span className="text-black">{requesterName}</span>
              {" 님이 가족 등록을 요청하였습니다."}
            </>
          ) : (
            "가족 등록 요청을 수락하시겠습니까?"
          )}
        </p>

        <form
          className="mt-[28px]"
          onSubmit={(event) => {
            event.preventDefault();
            void handleRespond("accept");
          }}
        >
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-col border-0 p-0"
          >
            {/* 아이디 */}
            {requesterEmail && (
              <div>
                <label
                  htmlFor="family-requester-email"
                  className="mb-[8px] block text-body-m-16 text-black"
                >
                  아이디
                </label>

                <input
                  id="family-requester-email"
                  type="text"
                  value={requesterEmail}
                  readOnly
                  className="
                    h-[38px] w-full rounded-[10px]
                    border border-gray-02 bg-white
                    px-[14px] text-body-r-16 text-black
                    outline-none
                  "
                />
              </div>
            )}

            {/* 닉네임 */}
            <div className={requesterEmail ? "mt-[24px]" : ""}>
              <label
                htmlFor="family-accept-nickname"
                className="mb-[8px] block text-body-m-16 text-black"
              >
                닉네임
              </label>

              <input
                ref={nicknameRef}
                id="family-accept-nickname"
                type="text"
                value={nickname}
                onChange={(event) => {
                  setNickname(event.target.value);
                  setErrorMessage("");
                }}
                placeholder="가족의 닉네임을 설정해주세요."
                aria-describedby={
                  errorMessage ? "family-accept-error" : undefined
                }
                className="
                  h-[38px] w-full rounded-[10px]
                  border border-gray-02 bg-white
                  px-[14px] text-body-r-16 text-black
                  outline-none placeholder:text-gray-01
                  focus:border-primary-01
                "
              />
            </div>

            <div className="min-h-[44px] pt-[12px]">
              {errorMessage && (
                <p
                  id="family-accept-error"
                  role="alert"
                  className="text-body-r-12 text-red-500"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            {/* 버튼 */}
            <div className="mt-[28px] flex gap-[10px]">
              <button
                type="button"
                onClick={() => void handleRespond("reject")}
                className="
                  flex h-[48px] flex-1
                  items-center justify-center
                  rounded-[14px] bg-gray-02
                  text-button-b-20 text-gray-01
                  cursor-pointer
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {pendingAction === "reject" ? "거절 중..." : "거절"}
              </button>

              <button
                type="submit"
                className="
                  flex h-[48px] flex-1
                  items-center justify-center
                  rounded-[14px] bg-primary-01
                  text-button-b-20 text-white
                  cursor-pointer
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {pendingAction === "accept" ? "수락 중..." : "수락"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}