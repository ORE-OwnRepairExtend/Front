import { useNavigate } from "react-router-dom";
import ProfileImage from "./ProfileImage";

import editIcon from "../../assets/icons/edit.svg";

type ProfileCardProps = {
  name: string;
  imageUrl?: string;
};

export default function ProfileCard({ name, imageUrl }: ProfileCardProps) {
  const navigate = useNavigate();

  const EditClick = () => {
    navigate("/mypage/edit");
  };

  return (
    <div className="flex flex-col items-center gap-[12px]">
      {/* 프로필 이미지 + 수정 버튼 */}
      <div className="relative">
        <ProfileImage imageUrl={imageUrl} alt={name} />

        <button
          type="button"
          onClick={EditClick}
          aria-label="프로필 수정"
          className="
            absolute bottom-[-5px] right-[-15px]
            flex h-[32px] w-[32px] items-center justify-center
            rounded-full bg-secondary-01
            cursor-pointer
          "
        >
          <img src={editIcon} alt="수정" className="h-[20px] w-[25px]" />
        </button>
      </div>

      {/* 이름 */}
      <p className="text-center text-body-b-16">{name}</p>
    </div>
  );
}
