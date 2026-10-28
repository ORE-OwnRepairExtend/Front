import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import FamilyManagement from "../../components/my/FamilyManagement";
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

type FamilyMember = {
  id: string;
  relation: string;
  name: string;
  email: string;
  profileImage?: string;
};

export default function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode = location.pathname === "/mypage/edit";

  /*
   * 가족 관리 화면 표시 여부
   *
   * false: 기존 마이페이지 메뉴
   * true: 가족 관리 UI
   */
  const [isFamilyManagement, setIsFamilyManagement] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /*
   * TODO:
   * 백엔드 가족 관리 API가 확정되면
   * API 조회 결과로 교체할 것.
   */
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      relation: "엄마",
      name: "ORE User2",
      email: "oreouser2@gmail.com",
    },
    {
      id: "2",
      relation: "아빠",
      name: "ORE User3",
      email: "oreouser3@gmail.com",
    },
    {
      id: "3",
      relation: "동생",
      name: "ORE User4",
      email: "oreouser4@gmail.com",
    },
  ]);

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

      alert(
        "사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.",
      );

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
        formData.append(
          "profileImage",
          editImageFile,
        );
      }

      const response =
        await api.patch<UserProfileResponse>(
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
      console.error(
        "프로필 수정 실패:",
        error,
      );

      alert(
        "프로필 수정에 실패했습니다. 다시 시도해주세요.",
      );
    }
  };

  const handleImageChange = (file: File) => {
    const previewUrl =
      URL.createObjectURL(file);

    setEditImageUrl(previewUrl);
    setEditImageFile(file);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(
        "로그아웃 API 실패:",
        error,
      );
    } finally {
      localStorage.removeItem(
        "accessToken",
      );
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  };

  /*
   * 가족 관리 화면 열기
   */
  const handleOpenFamilyManagement = () => {
    setIsFamilyManagement(true);
  };

  /*
   * 가족 관리 화면 닫기
   */
  const handleCloseFamilyManagement = () => {
    setIsFamilyManagement(false);
  };

  /*
   * 가족 삭제
   *
   * 현재는 프론트 state에서만 삭제.
   * 가족 삭제 API가 확정되면
   * API 호출 후 목록을 갱신하도록 변경.
   */
  const handleDeleteFamilyMember = (
    memberId: string,
  ) => {
    const shouldDelete = window.confirm(
      "가족 구성원을 삭제하시겠습니까?",
    );

    if (!shouldDelete) {
      return;
    }

    setFamilyMembers((prev) =>
      prev.filter(
        (member) =>
          member.id !== memberId,
      ),
    );
  };

  /*
   * 가족 추가
   *
   * 아직 가족 초대 UI/API 명세가 없기 때문에
   * 임시 동작만 설정.
   */
  const handleAddFamilyMember = () => {
    alert(
      "가족 추가 기능은 초대 API 연동 후 구현할 예정입니다.",
    );
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
        {/* 헤더 */}
        <div className="relative">
          <Header
            title="My"
            showNotification={
              !isFamilyManagement
            }
          />

          {/* 가족 관리 닫기 버튼 */}
          {isFamilyManagement && (
            <button
              type="button"
              onClick={
                handleCloseFamilyManagement
              }
              aria-label="가족 관리 닫기"
              className="
                absolute
                right-[5px]
                top-[5px]
                flex h-[34px] w-[34px]
                items-center justify-center
                text-[34px]
                font-medium
                leading-none
                text-primary-02
                cursor-pointer
              "
            >
              ×
            </button>
          )}
        </div>

        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            no-scrollbar
          "
        >
          <div className="flex flex-col gap-[20px]">

            {/* 사용자 프로필 */}
            <ProfileBox
              name={name}
              email={email}
              imageUrl={
                isEditMode
                  ? editImageUrl
                  : imageUrl
              }
              isEditMode={isEditMode}
              editName={editName}
              onEditNameChange={
                setEditName
              }
              onEditStart={
                handleEditStart
              }
              onEditCancel={
                handleEditCancel
              }
              onEditSave={
                handleEditSave
              }
              onImageChange={
                handleImageChange
              }
            />

            {/* 가족 관리 모드 */}
            {isFamilyManagement ? (
              <FamilyManagement
                members={
                  familyMembers
                }
                onAddMember={
                  handleAddFamilyMember
                }
                onDeleteMember={
                  handleDeleteFamilyMember
                }
              />
            ) : (
              /*
               * 기본 마이페이지 메뉴
               */
              <MenuList
                items={[
                  {
                    label:
                      "계정 정보",
                    onClick: () => {},
                  },
                  {
                    label:
                      "가족 관리",
                    onClick:
                      handleOpenFamilyManagement,
                  },
                  {
                    label:
                      "이용 약관",
                    onClick: () => {},
                  },
                  {
                    label:
                      "로그아웃",
                    onClick:
                      handleLogout,
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}