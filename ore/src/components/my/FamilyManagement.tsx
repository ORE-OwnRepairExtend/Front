import profileIcon from "../../assets/icons/profile.svg";

type FamilyMember = {
  id: string;
  relation: string;
  name: string;
  email: string;
};

type FamilyManagementProps = {
  members: FamilyMember[];
  onAddMember: () => void;
  onDeleteMember: (memberId: string) => void;
};

export default function FamilyManagement({
  members,
  onAddMember,
  onDeleteMember,
}: FamilyManagementProps) {
  return (
    <div className="flex w-full flex-col gap-[20px]">
      <h2 className="text-body-b-16 text-primary-01">
        가족 관리
      </h2>

      <div
        className="
          flex min-h-[250px] w-full
          items-center gap-[10px]
          overflow-x-auto
          rounded-[20px]
          bg-white
          px-[22px] py-[20px]
          no-scrollbar
        "
      >
        {members.map((member) => (
          <FamilyMemberCard
            key={member.id}
            member={member}
            onDelete={() =>
              onDeleteMember(member.id)
            }
          />
        ))}

        <AddFamilyCard
          onClick={onAddMember}
        />
      </div>
    </div>
  );
}

type FamilyMemberCardProps = {
  member: FamilyMember;
  onDelete: () => void;
};

function FamilyMemberCard({
  member,
  onDelete,
}: FamilyMemberCardProps) {
  return (
    <div
      className="
        relative
        flex h-[250px] w-[191px]
        shrink-0
        flex-col items-center
        rounded-[22px]
        border-[2px]
        border-primary-01
        bg-white
        px-[12px]
        py-[18px]
      "
    >
      <button
        type="button"
        onClick={onDelete}
        aria-label={`${member.relation} 삭제`}
        className="
          absolute
          right-[12px]
          top-[10px]
          flex h-[24px] w-[24px]
          items-center justify-center
          text-[30px]
          font-medium
          leading-none
          text-primary-01
          cursor-pointer
        "
      >
        ×
      </button>

      <p
        className="
          mt-[2px]
          text-body-b-16
          text-primary-01
        "
      >
        {member.relation}
      </p>

      <div
        className="
          mt-[18px]
          flex h-[100px] w-[100px]
          items-center justify-center
          overflow-hidden
          rounded-[30px]
          bg-gray-02
        "
      >
        <img
          src={profileIcon}
          alt={`${member.relation} 프로필`}
          className="
            h-[100px]
            w-[100px]
            object-contain
          "
        />
      </div>

      <div
        className="
          mt-[16px]
          flex w-full
          flex-col
          items-center
        "
      >
        <p className="text-body-sb-12 text-gray-01">
          {member.name}
        </p>

        <div
          className="
            mt-[2px]
            h-[2px] w-full
            bg-gray-01
          "
        />

        <p
          className="
            mt-[2px]
            max-w-full
            truncate
            text-body-sb-12
            text-gray-01
          "
        >
          {member.email}
        </p>
      </div>
    </div>
  );
}

type AddFamilyCardProps = {
  onClick: () => void;
};

function AddFamilyCard({
  onClick,
}: AddFamilyCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="가족 추가"
      className="
        flex h-[250px] w-[75px]
        shrink-0
        items-center justify-center
        rounded-[18px]
        border-[2px]
        border-gray-02
        bg-white
        text-[32px]
        font-light
        text-gray-02
        transition-colors
        hover:bg-neutral-04
        cursor-pointer
      "
    >
      +
    </button>
  );
}