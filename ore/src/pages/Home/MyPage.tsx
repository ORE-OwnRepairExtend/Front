import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import ProfileBox from "../../components/profile/ProfileBox";
import SecondLayout from "../../layout/SecondLayout";
import { api } from "../../api/api";

type UserProfileResponse = {
  userId: string;
  email: string;
  name: string;
  profileImage: string;
  createdAt: string;
};

export default function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode = location.pathname === "/mypage/edit";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<UserProfileResponse>("/users/me");

      const user = response.data;

      setEmail(user.email);
      setName(user.name);
      setImageUrl(user.profileImage);

      setEditName(user.name);
      setEditImageUrl(user.profileImage);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      alert("사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditStart = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);
    navigate("/mypage/edit");
  };

  const handleEditCancel = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);
    setEditImageFile(null);

    navigate("/mypage");
  };

  const handleEditSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", editName);

      if (editImageFile) {
        formData.append("profileImage", editImageFile);
      }

      const response = await api.patch<UserProfileResponse>(
        "/users/me",
        formData,
      );

      const user = response.data;

      setName(user.name);
      setImageUrl(user.profileImage);

      setEditName(user.name);
      setEditImageUrl(user.profileImage);
      setEditImageFile(null);

      navigate("/mypage");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setEditImageUrl(previewUrl);
    setEditImageFile(file);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("로그아웃 API 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  };

  if (isLoading) {
    return (
      <SecondLayout>
        <div className="flex h-full flex-col">
          <Header title="My" />

          <div className="flex flex-1 items-center justify-center">
            <p className="text-body-m-14 text-gray-01">
              사용자 정보를 불러오는 중입니다.
            </p>
          </div>
        </div>
      </SecondLayout>
    );
  }

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="My" />

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-[43px]">
            <ProfileBox
              name={name}
              email={email}
              imageUrl={isEditMode ? editImageUrl : imageUrl}
              isEditMode={isEditMode}
              editName={editName}
              onEditNameChange={setEditName}
              onEditStart={handleEditStart}
              onEditCancel={handleEditCancel}
              onEditSave={handleEditSave}
              onImageChange={handleImageChange}
            />

            <MenuList
              items={[
                { label: "계정 정보", onClick: () => {} },
                { label: "이용 약관", onClick: () => {} },
                { label: "로그아웃", onClick: handleLogout },
              ]}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}