import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import FamilyManagement from "../../components/my/FamilyManagement";
import FamilyRegisterModal from "../../components/my/FamilyRegisterModal";
import Modal from "../../components/common/Modal";
import ProfileBox from "../../components/profile/ProfileBox";
import SecondLayout from "../../layout/SecondLayout";
import { api } from "../../api/api";
import {
  createFamilyInvitation,
  deleteFamilyMember,
  getFamilyErrorMessage,
  getFamilyMembers,
  type FamilyMember,
} from "../../api/family";

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

  // 가족 관리 화면 표시 여부
  const [isFamilyManagement, setIsFamilyManagement] = useState(false);

  // 가족 등록 모달 표시 여부
  const [isFamilyRegisterOpen, setIsFamilyRegisterOpen] = useState(false);

  // 삭제 대상 가족 ID
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const previewUrlRef = useRef<string | null>(null);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isFamilyLoading, setIsFamilyLoading] = useState(false);
  const [familyErrorMessage, setFamilyErrorMessage] = useState("");
  const [familyNotice, setFamilyNotice] = useState("");
  const [familyReloadKey, setFamilyReloadKey] = useState(0);
  const deletingRef = useRef(false);

  const clearPreviewUrl = () => {
    if (!previewUrlRef.current) return;

    URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
  };

  // 사용자 프로필 조회
  useEffect(() => {
    const controller = new AbortController();

    const fetchUserProfile = async () => {
      try {
        const response = await api.get<UserProfileResponse>("/users/me", {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        const user = response.data;

        setEmail(user.email);
        setName(user.name);
        setImageUrl(user.profileImage ?? "");

        setEditName(user.name);
        setEditImageUrl(user.profileImage ?? "");
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("사용자 정보 조회 실패:", error);

        alert(
          "사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.",
        );

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchUserProfile();

    return () => controller.abort();
  }, [navigate]);

  // 가족 관리 진입 시 목록 조회
  useEffect(() => {
    if (!isFamilyManagement) return;

    const controller = new AbortController();

    const fetchMembers = async () => {
      try {
        setIsFamilyLoading(true);
        setFamilyErrorMessage("");

        const members = await getFamilyMembers(controller.signal);

        if (controller.signal.aborted) return;

        setFamilyMembers(members.filter((member) => !member.isMe));
      } catch (error) {
        if (controller.signal.aborted) return;

        setFamilyErrorMessage(
          getFamilyErrorMessage(
            error,
            "가족 목록을 불러오지 못했습니다.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsFamilyLoading(false);
        }
      }
    };

    void fetchMembers();

    return () => controller.abort();
  }, [isFamilyManagement, familyReloadKey]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // 프로필 수정 시작
  const handleEditStart = () => {
    clearPreviewUrl();
    setEditName(name);
    setEditImageUrl(imageUrl);
    setEditImageFile(null);

    navigate("/mypage/edit");
  };

  // 프로필 수정 취소
  const handleEditCancel = () => {
    if (savingRef.current) return;

    clearPreviewUrl();
    setEditName(name);
    setEditImageUrl(imageUrl);
    setEditImageFile(null);

    navigate("/mypage");
  };

  // 프로필 수정 저장
  const handleEditSave = async () => {
    if (savingRef.current) return;

    try {
      savingRef.current = true;
      setIsSaving(true);

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

      clearPreviewUrl();

      setName(user.name);
      setImageUrl(user.profileImage ?? "");
      setEditName(user.name);
      setEditImageUrl(user.profileImage ?? "");
      setEditImageFile(null);

      navigate("/mypage");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  // 프로필 이미지 변경
  const handleImageChange = (file: File) => {
    clearPreviewUrl();

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setEditImageUrl(previewUrl);
    setEditImageFile(file);
  };

  // 로그아웃
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

  // 가족 관리 화면 열기
  const handleOpenFamilyManagement = () => {
    setFamilyNotice("");
    setFamilyErrorMessage("");
    setIsFamilyManagement(true);
  };

  // 가족 관리 화면 닫기
  const handleCloseFamilyManagement = () => {
    if (deletingRef.current) return;

    setIsFamilyManagement(false);
    setIsFamilyRegisterOpen(false);
    setDeleteTargetId(null);
    setFamilyErrorMessage("");
    setFamilyNotice("");
  };

  // 가족 추가 모달 열기
  const handleAddFamilyMember = () => {
    setFamilyNotice("");
    setIsFamilyRegisterOpen(true);
  };

  // 가족 삭제 버튼 클릭
  const handleDeleteFamilyMember = (memberId: string) => {
    if (deletingRef.current) return;

    setFamilyErrorMessage("");
    setFamilyNotice("");
    setDeleteTargetId(memberId);
  };

  // 가족 삭제 취소
  const handleCancelDelete = () => {
    if (deletingRef.current) return;
    setDeleteTargetId(null);
  };

  // 가족 삭제 확인
  const handleConfirmDelete = async () => {
    if (!deleteTargetId || deletingRef.current) return;

    const targetId = deleteTargetId;

    try {
      deletingRef.current = true;

      await deleteFamilyMember(targetId);

      setFamilyMembers((prev) =>
        prev.filter((member) => member.userId !== targetId),
      );

      setDeleteTargetId(null);
      setFamilyNotice("가족 연결을 해제했습니다.");
    } catch (error) {
      setDeleteTargetId(null);
      setFamilyErrorMessage(
        getFamilyErrorMessage(
          error,
          "가족 구성원 삭제에 실패했습니다.",
        ),
      );
    } finally {
      deletingRef.current = false;
    }
  };

  // 가족 등록 요청
  const handleFamilyRequest = async (
    recipientEmail: string,
    nickname: string,
  ) => {
    const invitation = await createFamilyInvitation({
      recipientEmail,
      nickname,
    });

    setFamilyNotice(
      `${invitation.recipientName} 님에게 가족 초대를 보냈습니다.`,
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
              showNotification={!isFamilyManagement}
            />

            {/* 가족 관리 닫기 */}
            {isFamilyManagement && (
              <button
                type="button"
                onClick={handleCloseFamilyManagement}
                aria-label="가족 관리 닫기"
                className="
                  absolute right-[5px] top-[5px]
                  flex h-[34px] w-[34px]
                  items-center justify-center
                  text-[34px] font-medium leading-none
                  text-primary-02 cursor-pointer
                "
              >
                ×
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-[20px]">
              {/* 사용자 프로필 */}
              <fieldset
                disabled={isSaving}
                className="min-w-0 border-0 p-0"
              >
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
              </fieldset>

              {/* 가족 관리 화면 */}
              {isFamilyManagement ? (
                <div className="flex flex-col gap-[12px]">
                  {familyNotice && (
                    <p
                      role="status"
                      className="text-body-r-12 text-primary-01"
                    >
                      {familyNotice}
                    </p>
                  )}

                  {familyErrorMessage && (
                    <div className="flex items-center gap-[10px]">
                      <p
                        role="alert"
                        className="text-body-r-12 text-red-500"
                      >
                        {familyErrorMessage}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setFamilyReloadKey((prev) => prev + 1)
                        }
                        className="shrink-0 cursor-pointer text-body-r-12 text-primary-01"
                      >
                        다시 조회
                      </button>
                    </div>
                  )}

                  {isFamilyLoading ? (
                    <p className="py-[20px] text-body-m-14 text-gray-01">
                      가족 목록을 불러오는 중입니다.
                    </p>
                  ) : (
                    <FamilyManagement
                      members={familyMembers.map((member) => ({
                        id: member.userId,
                        relation: member.nickname || member.name,
                        name: member.name,
                        email: member.email,
                        profileImageUrl: member.profileImageUrl,
                      }))}
                      onAddMember={handleAddFamilyMember}
                      onDeleteMember={handleDeleteFamilyMember}
                    />
                  )}
                </div>
              ) : (
                <MenuList
                  items={[
                    {
                      label: "계정 정보",
                      onClick: () => {},
                    },
                    {
                      label: "가족 관리",
                      onClick: handleOpenFamilyManagement,
                    },
                    {
                      label: "이용 약관",
                      onClick: () => {},
                    },
                    {
                      label: "로그아웃",
                      onClick: handleLogout,
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
        isOpen={isFamilyRegisterOpen}
        onClose={() => setIsFamilyRegisterOpen(false)}
        onRequest={handleFamilyRequest}
      />

      {/* 가족 삭제 확인 모달 */}
      <Modal
        open={deleteTargetId !== null}
        type="confirm"
        title="해당 구성원을 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        onClose={handleCancelDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}