type CheckboxProps = {
  checked: boolean;
  onChange?: () => void;
};

export default function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        flex items-center justify-center
        w-[34px] h-[34px] p-[2px]
        rounded-[10px]
        transition-colors duration-200
        cursor-pointer
        
        ${checked ? "bg-primary-01" : "bg-gray-02"}
      `}
    >
      <img src="/icons/check.svg" alt="체크" width={20} height={15} />
    </button>
  );
}
