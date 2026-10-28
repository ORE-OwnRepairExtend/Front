import { useEffect, useState } from "react";

type CheckStatus = "idle" | "checking" | "success" | "error";

type FamilyRegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;

  // 아이디 존재 여부 확인
  onCheckUserId: (userId: string) => Promise<boolean>;

  // 가족 요청
  onRequest: (userId: string, nickname: string) => Promise<void>;
};

export default function FamilyRegisterModal({
  isOpen,
  onClose,
  onCheckUserId,
  onRequest,
}: FamilyRegisterModalProps) {
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");

  const [checkStatus, setCheckStatus] =
    useState<CheckStatus>("idle");

  const [isRequesting, setIsRequesting] =
    useState(false);

  // 모달을 다시 열 때 입력값 초기화
  useEffect(() => {
    if (!isOpen) return;

    setUserId("");
    setNickname("");
    setCheckStatus("idle");
    setIsRequesting(false);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const trimmedUserId = userId.trim();
  const trimmedNickname = nickname.trim();

  const isCheckDisabled =
    trimmedUserId.length === 0 ||
    checkStatus === "checking";

  const isRequestDisabled =
    checkStatus !== "success" ||
    trimmedNickname.length === 0 ||
    isRequesting;

  const handleUserIdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUserId(e.target.value);

    // 확인한 후 아이디를 다시 수정하면
    // 확인 상태 초기화
    setCheckStatus("idle");
  };

  const handleCheckUser = async () => {
    if (isCheckDisabled) return;

    try {
      setCheckStatus("checking");

      const exists =
        await onCheckUserId(trimmedUserId);

      if (exists) {
        setCheckStatus("success");
        return;
      }

      setCheckStatus("error");
    } catch (error) {
      console.error(
        "회원 존재 여부 확인 실패:",
        error,
      );

      setCheckStatus("error");
    }
  };

  const handleRequest = async () => {
    if (isRequestDisabled) return;

    try {
      setIsRequesting(true);

      await onRequest(
        trimmedUserId,
        trimmedNickname,
      );

      onClose();
    } catch (error) {
      console.error(
        "가족 등록 요청 실패:",
        error,
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/20
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          flex h-[500px] w-[400px]
          flex-col
          rounded-[22px]
          bg-secondary-01
          px-[24px]
          pt-[52px]
          pb-[30px]
        "
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="가족 등록 닫기"
          className="
            absolute right-[24px] top-[18px]
            flex h-[28px] w-[28px]
            items-center justify-center
            text-[30px] font-semibold
            leading-none
            text-primary-01
            cursor-pointer
          "
        >
          ×
        </button>

        {/* 제목 */}
        <h2
          className="
            text-center
            text-title-b-32
            text-primary-01
          "
        >
          가족 등록
        </h2>

        {/* 폼 */}
        <div className="mt-[58px] flex flex-col">
          {/* 아이디 */}
          <div>
            <label
              htmlFor="family-user-id"
              className="
                mb-[8px] block
                text-body-m-16
                text-black
              "
            >
              아이디
            </label>

            <div className="flex items-start gap-[10px]">
              <input
                id="family-user-id"
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                placeholder="아이디를 입력해주세요."
                className="
                  h-[38px] flex-1
                  rounded-[9px]
                  border border-gray-02
                  bg-white
                  px-[14px]
                  text-body-r-16
                  outline-none
                  placeholder:text-gray-01
                  focus:border-primary-01
                "
              />

              <button
                type="button"
                disabled={isCheckDisabled}
                onClick={handleCheckUser}
                className={`
                  flex h-[38px] w-[46px]
                  shrink-0
                  items-center justify-center
                  rounded-[9px]
                  border border-gray-02
                  bg-white
                  text-body-r-16
                  transition-opacity

                  ${
                    isCheckDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                {checkStatus === "checking"
                  ? "..."
                  : checkStatus === "success"
                    ? "완료"
                    : "확인"}
              </button>
            </div>

            {/* 존재하지 않는 회원 */}
            <div className="h-[28px]">
              {checkStatus === "error" && (
                <p
                  className="
                    mt-[6px]
                    px-[6px]
                    text-body-r-16
                    text-gray-01
                  "
                >
                  존재하지 않는 회원입니다.
                </p>
              )}
            </div>
          </div>

          {/* 닉네임 */}
          <div className="mt-[4px]">
            <label
              htmlFor="family-nickname"
              className="
                mb-[8px] block
                text-body-m-16
                text-black
              "
            >
              닉네임
            </label>

            <input
              id="family-nickname"
              type="text"
              value={nickname}
              onChange={(e) =>
                setNickname(e.target.value)
              }
              placeholder="가족의 닉네임을 설정해주세요."
              className="
                h-[38px] w-full
                rounded-[9px]
                border border-gray-02
                bg-white
                px-[14px]
                text-body-r-16
                outline-none
                placeholder:text-gray-01
                focus:border-primary-01
              "
            />
          </div>

          {/* 요청 버튼 */}
          <button
            type="button"
            disabled={isRequestDisabled}
            onClick={handleRequest}
            className={`
              mt-[48px]
              flex h-[48px] w-full
              items-center justify-center
              rounded-[14px]
              bg-primary-01
              text-button-b-20
              text-white
              transition-opacity

              ${
                isRequestDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            `}
          >
            {isRequesting
              ? "요청 중..."
              : "요청"}
          </button>

          <p
            className="
              mt-[8px]
              text-center
              text-body-m-16
              text-gray-01
            "
          >
            요청이 수락되면 가족으로 등록됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}