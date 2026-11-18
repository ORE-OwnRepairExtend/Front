import { useEffect, useId, useRef, useState } from "react";

import closeIcon from "../../assets/icons/close.svg";
import {
  findTransferRecipient,
  type OwnershipTransfer,
} from "../../api/ownershipTransferDemo";
import CommonButton from "../common/CommonButton";
import Modal from "../common/Modal";

type OwnershipTransferModalProps =
  | { mode: "request"; onClose: () => void; onRequest: (email: string) => void }
  | {
      mode: "review" | "reject";
      transfer: OwnershipTransfer;
      onClose: () => void;
      onAccept: () => void;
      onReject: () => void;
    };

const actionClass =
  "!h-[48px] !rounded-[15px] !text-[20px] !font-bold !leading-[28px]";
const rejectClass = `${actionClass} flex-1 !bg-gray-02 !text-gray-01`;
const fieldClass =
  "h-[40px] w-full rounded-[10px] border border-gray-02 bg-white px-[14px] text-body-m-16";

export default function OwnershipTransferModal(
  props: OwnershipTransferModalProps,
) {
  const { mode, onClose } = props;
  const [hasConsented, setHasConsented] = useState(false);
  const [email, setEmail] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const emailId = useId();
  const productId = useId();

  useEffect(() => {
    if (mode === "reject") return;

    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, [mode]);

  if (mode === "reject") {
    return (
      <Modal
        open
        title="소유권 이전을 거절하시겠습니까?"
        onClose={onClose}
        onCancel={onClose}
        onConfirm={props.onReject}
        cancelText="취소"
        confirmText="거절"
      />
    );
  }

  function verifyEmail() {
    try {
      const recipient = findTransferRecipient(email);
      setVerifiedEmail(email.trim());
      setLookupMessage(`${recipient.name} 님을 확인했습니다.`);
    } catch (error) {
      setVerifiedEmail("");
      setLookupMessage(
        error instanceof Error ? error.message : "아이디 확인에 실패했습니다.",
      );
    }
  }

  function submitRequest() {
    if (
      props.mode !== "request" ||
      !verifiedEmail ||
      verifiedEmail !== email.trim()
    ) {
      return;
    }

    try {
      props.onRequest(verifiedEmail);
    } catch (error) {
      setLookupMessage(
        error instanceof Error
          ? error.message
          : "소유권 이전 요청에 실패했습니다.",
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="
        fixed inset-0 m-auto w-[min(420px,calc(100%_-_32px))] max-w-none
        max-h-[calc(100dvh_-_32px)] overflow-auto rounded-[20px]
        bg-secondary-01 px-[22px] py-[32px] text-black backdrop:bg-gray-01/45
      "
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="absolute right-[22px] top-[22px] cursor-pointer"
      >
        <img src={closeIcon} alt="" className="h-[24px] w-[24px]" />
      </button>

      <div
        className={`flex min-h-[440px] flex-col ${mode === "review" ? "justify-start pt-[30px]" : "justify-center"}`}
      >
        <h2
          id={titleId}
          className="mb-[32px] text-center text-title-b-32 text-primary-01"
        >
          소유권 이전
        </h2>

        {props.mode === "review" ? (
          <>
            <p className="-mt-[24px] mb-[24px] text-center text-body-m-16 text-gray-01">
              <strong className="text-black">
                {props.transfer.sender.name}
              </strong>
              {" 님이 소유권 이전을 요청하였습니다."}
            </p>

            <div className="flex flex-col gap-[20px]">
              <label
                className="flex flex-col gap-[6px] text-body-m-16"
                htmlFor={emailId}
              >
                아이디
                <input
                  id={emailId}
                  className={fieldClass}
                  value={props.transfer.sender.email}
                  readOnly
                />
              </label>

              <label
                className="flex flex-col gap-[6px] text-body-m-16"
                htmlFor={productId}
              >
                제품명
                <input
                  id={productId}
                  className={fieldClass}
                  value={props.transfer.productName}
                  readOnly
                />
              </label>
            </div>

            <div className="mt-auto flex gap-[10px] pb-[28px] pt-[44px]">
              <CommonButton className={rejectClass} onClick={props.onReject}>
                거절
              </CommonButton>
              <CommonButton
                className={`${actionClass} flex-1`}
                onClick={props.onAccept}
              >
                수락
              </CommonButton>
            </div>
          </>
        ) : !hasConsented ? (
          <>
            <div className="text-center text-body-m-16 leading-[1.55]">
              <p>
                소유권을 이전하면
                <br />
                <span className="text-point-02">
                  제품 정보, 보증기간, 매뉴얼, 수리 이력
                </span>
                이<br />새 소유자에게 이전됩니다.
              </p>
              <p className="mt-[24px]">
                OCR 원문과 채팅, 관련된 사진 정보는
                <br />
                이전되지 않습니다.
              </p>
            </div>

            <div className="mt-[32px] flex gap-[10px]">
              <CommonButton className={rejectClass} onClick={onClose}>
                거절
              </CommonButton>
              <CommonButton
                className={`${actionClass} flex-1`}
                onClick={() => setHasConsented(true)}
              >
                수락
              </CommonButton>
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                verifyEmail();
              }}
            >
              <label
                htmlFor={emailId}
                className="mb-[6px] block text-body-m-16"
              >
                아이디
              </label>
              <div className="flex gap-[10px]">
                <input
                  id={emailId}
                  type="email"
                  autoComplete="off"
                  className={`${fieldClass} min-w-0`}
                  placeholder="아이디를 입력해주세요."
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setVerifiedEmail("");
                    setLookupMessage("");
                  }}
                />
                <button
                  type="submit"
                  className="h-[40px] shrink-0 cursor-pointer rounded-[10px] border border-gray-02 bg-white px-[10px] text-body-m-16 text-gray-01"
                >
                  확인
                </button>
              </div>
            </form>

            <p
              role="status"
              className="min-h-[42px] px-[4px] pt-[6px] text-body-m-16 text-gray-01"
            >
              {lookupMessage}
            </p>

            <CommonButton
              className={`${actionClass} w-full`}
              disabled={!verifiedEmail}
              onClick={submitRequest}
            >
              요청
            </CommonButton>
            <p className="mt-[8px] text-center text-body-m-16 text-gray-01">
              요청 후 취소 <span className="text-point-02">불가</span>합니다.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}