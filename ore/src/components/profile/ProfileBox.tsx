import CommonInputBox from "../common/CommonInputBox";
import ProfileImage from "./ProfileImage";

type ProfileBoxProps = {
  name: string;
  email: string;
  imageUrl?: string;
  isEditMode?: boolean;
  editName?: string;
  onEditNameChange?: (value: string) => void;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onEditSave?: () => void;
  onImageChange?: (file: File) => void;
};

export default function ProfileBox({
  name,
  email,
  imageUrl,
  isEditMode = false,
  editName = "",
  onEditNameChange,
  onEditStart,
  onEditCancel,
  onEditSave,
  onImageChange,
}: ProfileBoxProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageChange) return;
    onImageChange(file);
  };

  return (
    <div
      className="
        flex h-[150px] w-full items-center justify-center
        rounded-[20px] bg-primary-01
      "
    >
      <div className="flex items-center gap-[30px]">
        <div className="relative">
          {/* 프로필 이미지 */}
          <ProfileImage imageUrl={imageUrl} alt={name} />

          {/* 이미지 변경 버튼 */}
          {isEditMode && (
            <label
              className="
        absolute inset-0
        flex items-center justify-center
        cursor-pointer
        rounded-[30px]
        hover:bg-black/40
      "
            >
              <span className="px-[16px] py-[6px] rounded-[10px] bg-primary-01 text-body-m-10 text-white">
                이미지 변경
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        {/* 이름 */}
        <div
          className="
            flex h-[86px] w-[350px] flex-col items-start justify-center gap-[10px]
          "
        >
          <div className="flex w-full flex-col items-start gap-[4px]">
            <div className="h-[36px] w-full flex items-center">
              {isEditMode ? (
                <CommonInputBox
                  variant="profile"
                  value={editName}
                  onChange={(e) => onEditNameChange?.(e.target.value)}
                />
              ) : (
                <p className="w-full text-body-b-16 text-white">{name}</p>
              )}
            </div>
            {/* 구분선 */}
            <div className="h-[2px] w-full bg-white" />
            {/* 이메일 */}
            <p className="text-body-sb-12 text-gray-02">{email}</p>
          </div>

          {/* 수정 취소, 확인 버튼 */}
          {isEditMode ? (
            <div className="flex gap-[8px]">
              <button
                type="button"
                onClick={onEditCancel}
                className="
                  flex h-[25px] w-[60px] items-center justify-center
                  rounded-[7px] border-[2px] border-white
                  text-body-m-10 text-white cursor-pointer
                "
              >
                취소
              </button>

              <button
                type="button"
                onClick={onEditSave}
                className="
                  flex h-[25px] w-[60px] items-center justify-center
                  rounded-[7px] bg-white
                  text-body-m-10 text-primary-01 cursor-pointer
                "
              >
                저장
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onEditStart}
              className="
                  flex h-[25px] w-[100px] py-[10px] items-center justify-center
                  rounded-[7px] border-[2px] border-white
                  text-body-m-10 text-white cursor-pointer
                "
            >
              프로필 수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
