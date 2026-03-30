import ProfileImage from "./ProfileImage";

type ProfileBoxProps = {
  name: string;
  email: string;
  imageUrl?: string;
  onEditProfile?: () => void;
};

export default function ProfileBox({
  name,
  email,
  imageUrl,
  onEditProfile,
}: ProfileBoxProps) {
  return (
    <div
      className="
        flex h-[150px] w-full items-center justify-center
        rounded-[20px] bg-primary-01
      "
    >
      <div className="flex items-center gap-[30px]">
        {/* 프로필 이미지 */}
        <ProfileImage imageUrl={imageUrl} alt={name} />

        {/* 텍스트 + 버튼 */}
        <div
          className="
          flex h-[86px] w-[350px] flex-col items-start justify-center gap-[10px]
        "
        >
          <div className="flex w-full flex-col items-start gap-[4px]">
            {/* 이름 */}
            <p className="text-body-b-16 text-white">{name}</p>
            {/* 구분선 */}
            <div className="w-full h-[2px] bg-white" />
            {/* 이메일 */}
            <p className="text-body-sb-12 text-gray-02">{email}</p>
          </div>

          <button
            type="button"
            onClick={onEditProfile}
            className="
            flex h-[20px] w-full items-center justify-center
            rounded-[7px] border-[2px] border-white
            text-body-m-10 text-white
            cursor-pointer
          "
          >
            프로필 수정하기
          </button>
        </div>
      </div>
    </div>
  );
}
