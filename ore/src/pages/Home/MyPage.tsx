import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import FamilyManagement from "../../components/my/FamilyManagement";
import FamilyRegisterModal from "../../components/my/FamilyRegisterModal";
import Modal from "../../components/common/Modal";
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
};

export default function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isEditMode =
    location.pathname === "/mypage/edit";

  // 가족 관리 화면 표시 여부
  const [
    isFamilyManagement,
    setIsFamilyManagement,
  ] = useState(false);

  // 가족 등록 모달 표시 여부
  const [
    isFamilyRegisterOpen,
    setIsFamilyRegisterOpen,
  ] = useState(false);

  // 삭제 대상 가족 ID
  const [
    deleteTargetId,
    setDeleteTargetId,
  ] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editName, setEditName] = useState("");
  const [
    editImageUrl,
    setEditImageUrl,
  ] = useState("");
  const [
    editImageFile,
    setEditImageFile,
  ] = useState<File | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /*
   * TODO:
   * 백엔드 가족 조회 API가 확정되면
   * API 조회 결과로 교체
   */
  const [
    familyMembers,
    setFamilyMembers,
  ] = useState<FamilyMember[]>([
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

  // 사용자 프로필 조회
  const fetchUserProfile = async () => {
    try {
      const response =
        await api.get<UserProfileResponse>(
          "/users/me",
        );

      const user = response.data;

      setEmail(user.email);
      setName(user.name);
      setImageUrl(user.profileImage);

      setEditName(user.name);
      setEditImageUrl(user.profileImage);
    } catch (error) {
      console.error(
        "사용자 정보 조회 실패:",
        error,
      );

      alert(
        "사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.",
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 프로필 수정 시작
  const handleEditStart = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);

    navigate("/mypage/edit");
  };

  // 프로필 수정 취소
  const handleEditCancel = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);
    setEditImageFile(null);

    navigate("/mypage");
  };

  // 프로필 수정 저장
  const handleEditSave = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "name",
        editName,
      );

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

  // 프로필 이미지 변경
  const handleImageChange = (
    file: File,
  ) => {
    const previewUrl =
      URL.createObjectURL(file);

    setEditImageUrl(previewUrl);
    setEditImageFile(file);
  };

  // 로그아웃
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

  // 가족 관리 화면 열기
  const handleOpenFamilyManagement =
    () => {
      setIsFamilyManagement(true);
    };

  // 가족 관리 화면 닫기
  const handleCloseFamilyManagement =
    () => {
      setIsFamilyManagement(false);
      setIsFamilyRegisterOpen(false);
      setDeleteTargetId(null);
    };

  // 가족 추가 모달 열기
  const handleAddFamilyMember =
    () => {
      setIsFamilyRegisterOpen(true);
    };

  // 가족 삭제 버튼 클릭
  const handleDeleteFamilyMember = (
    memberId: string,
  ) => {
    setDeleteTargetId(memberId);
  };

  // 가족 삭제 취소
  const handleCancelDelete = () => {
    setDeleteTargetId(null);
  };

  /*
   * 가족 삭제 확인
   *
   * 현재는 프론트 state에서만 삭제.
   * 백엔드 삭제 API 확정 후
   * API 성공 시 목록 갱신하도록 변경.
   */
  const handleConfirmDelete = () => {
    if (!deleteTargetId) {
      return;
    }

    setFamilyMembers((prev) =>
      prev.filter(
        (member) =>
          member.id !== deleteTargetId,
      ),
    );

    setDeleteTargetId(null);
  };

  /*
   * 아이디 존재 여부 확인
   *
   * TODO:
   * 백엔드 회원 존재 확인 API
   * 확정 후 실제 API 연결
   */
  const handleCheckFamilyUser = async (
    userId: string,
  ): Promise<boolean> => {
    console.log(
      "회원 존재 여부 확인:",
      userId,
    );

    return false;
  };

  /*
   * 가족 등록 요청
   *
   * TODO:
   * 가족 등록 요청 API
   * 확정 후 실제 API 연결
   */
  const handleFamilyRequest = async (
    userId: string,
    nickname: string,
  ) => {
    console.log(
      "가족 등록 요청",
      {
        userId,
        nickname,
      },
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
    <>
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

            {/* 가족 관리 닫기 */}
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

              {/* 가족 관리 화면 */}
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
                <MenuList
                  items={[
                    {
                      label:
                        "계정 정보",
                      onClick:
                        () => {},
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
                      onClick:
                        () => {},
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

      {/* 가족 등록 모달 */}
      <FamilyRegisterModal
        isOpen={
          isFamilyRegisterOpen
        }
        onClose={() =>
          setIsFamilyRegisterOpen(
            false,
          )
        }
        onCheckUserId={
          handleCheckFamilyUser
        }
        onRequest={
          handleFamilyRequest
        }
      />

      {/* 가족 삭제 확인 모달 */}
      <Modal
        open={
          deleteTargetId !== null
        }
        type="confirm"
        title="해당 구성원을 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onClose={
          handleCancelDelete
        }
        onCancel={
          handleCancelDelete
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </>
  );
}
