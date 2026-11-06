import { useEffect, useRef, useState } from "react";
import CommonButton from "../common/CommonButton";
import CommonInputBox from "../common/CommonInputBox";

import closeIcon from "../../assets/icons/close.svg";

type FamilyAcceptModalProps = {
  requesterName: string;
  requesterEmail: string;
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
  const isSubmittingRef = useRef(false);

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

      if (previousFocusedElement instanceof HTMLElement) {
        previousFocusedElement.focus();
      }
    };
  }, []);

  const handleClose = () => {
    if (isSubmittingRef.current) return;
    onClose();
  };

  const handleAccept = async () => {
    if (isSubmittingRef.current) return;

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setErrorMessage("가족의 닉네임을 입력해주세요.");
      nicknameRef.current?.focus();
      return;
    }

    try {
      isSubmittingRef.current = true;
      setPendingAction("accept");
      setErrorMessage("");

      await onAccept(trimmedNickname);
      onClose();
    } catch (error) {
      console.error("가족 요청 수락 실패:", error);
      setErrorMessage("가족 요청을 수락하지 못했습니다. 다시 시도해주세요.");
    } finally {
      isSubmittingRef.current = false;
      setPendingAction(null);
    }
  };

  const handleReject = async () => {
    if (isSubmittingRef.current) return;

    try {
      isSubmittingRef.current = true;
      setPendingAction("reject");
      setErrorMessage("");

      await onReject();
      onClose();
    } catch (error) {
      console.error("가족 요청 거절 실패:", error);
      setErrorMessage("가족 요청을 거절하지 못했습니다. 다시 시도해주세요.");
    } finally {
      isSubmittingRef.current = false;
      setPendingAction(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-01/80 p-[20px]"
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
          'button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        );

        if (!elements?.length) return;

        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
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
          relative flex max-h-[calc(100dvh-40px)]
          min-h-[500px] w-[400px] max-w-full
          flex-col overflow-y-auto
          rounded-[22px] bg-secondary-01
          px-[24px] pb-[48px] pt-[62px]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="가족 등록 닫기"
          className="
            absolute right-[24px] top-[24px]
            cursor-pointer disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <img src={closeIcon} alt="" className="h-[24px] w-[24px]" />
        </button>

        <h2
          id="family-accept-title"
          className="text-center text-title-b-32 text-primary-01"
        >
          가족 등록
        </h2>

        <p
          id="family-accept-description"
          className="mt-[12px] break-words text-center text-body-r-16 text-gray-01"
        >
          <span className="text-black">{requesterName}</span>
          {" 님이 가족 등록을 요청하였습니다."}
        </p>

        <form
          className="mt-[28px] flex flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            void handleAccept();
          }}
        >
          <fieldset
            disabled={isSubmitting}
            className="flex min-w-0 flex-1 flex-col border-0 p-0"
          >
            <label
              htmlFor="family-requester-email"
              className="mb-[8px] text-body-m-16 text-black"
            >
              아이디
            </label>

            <CommonInputBox
              id="family-requester-email"
              value={requesterEmail}
              onChange={() => {}}
              readOnly
              className="
                h-[38px] w-full
                !rounded-[10px] !border !border-gray-02
                bg-white !px-[14px] !py-0 !text-black
              "
            />

            <label
              htmlFor="family-accept-nickname"
              className="mb-[8px] mt-[24px] text-body-m-16 text-black"
            >
              닉네임
            </label>

            <input
              ref={nicknameRef}
              id="family-accept-nickname"
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setErrorMessage("");
              }}
              placeholder="가족의 닉네임을 설정해주세요."
              aria-invalid={Boolean(errorMessage)}
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

            <div className="min-h-[36px] pt-[6px]">
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

            <div className="mt-auto flex gap-[10px] pt-[36px]">
              <CommonButton
                variant="secondary"
                onClick={() => void handleReject()}
                className="
                  !h-[48px] flex-1 !rounded-[14px]
                  !bg-gray-02 !text-gray-01
                  !text-button-b-20
                "
              >
                {pendingAction === "reject" ? "거절 중..." : "거절"}
              </CommonButton>

              <CommonButton
                onClick={() => void handleAccept()}
                className="
                  !h-[48px] flex-1 !rounded-[14px]
                  !text-button-b-20
                "
              >
                {pendingAction === "accept" ? "수락 중..." : "수락"}
              </CommonButton>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}