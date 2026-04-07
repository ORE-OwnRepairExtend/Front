import { useState } from "react";
import Header from "../../components/header/Header";
import MenuList from "../../components/my/MenuList";
import ProfileBox from "../../components/profile/ProfileBox";
import SecondLayout from "../../layout/SecondLayout";
import { mockUserProfile } from "../../mocks/ueser";

export default function MyPage() {
  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState(mockUserProfile.name);
  const [imageUrl, setImageUrl] = useState(mockUserProfile.profileImage);

  const [editName, setEditName] = useState(mockUserProfile.name);
  const [editImageUrl, setEditImageUrl] = useState(
    mockUserProfile.profileImage,
  );

  const handleEditStart = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);
    setIsEditMode(true);
  };

  const handleEditCancel = () => {
    setEditName(name);
    setEditImageUrl(imageUrl);
    setIsEditMode(false);
  };

  const handleEditSave = () => {
    setName(editName);
    setImageUrl(editImageUrl);
    setIsEditMode(false);
  };

  const handleImageChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setEditImageUrl(previewUrl);
  };

  return (
    <SecondLayout>
      <div className="flex h-full flex-col">
        <Header title="My" />

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-[43px]">
            <ProfileBox
              name={name}
              email={mockUserProfile.email}
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
                { label: "로그아웃", onClick: () => {} },
              ]}
            />
          </div>
        </div>
      </div>
    </SecondLayout>
  );
}
