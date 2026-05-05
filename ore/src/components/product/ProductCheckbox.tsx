type ProductCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export default function ProductCheckbox({
  checked,
  onChange,
  label,
}: ProductCheckboxProps) {
  return (
    <label
      className="
        flex h-[40px] cursor-pointer items-center gap-[7px]
      "
    >
      {/* 실제 checkbox (숨김) */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />

      {/* 커스텀 UI */}
      <div
        className={`
          flex items-center justify-center
          w-[20px] h-[20px] rounded-full
          ${checked ? "bg-primary-01" : "bg-gray-02"}
        `}
      >
        <div className="w-[10px] h-[10px] rounded-full bg-white" />
      </div>

      {/* 텍스트 */}
      {label && <span className="text-body-r-15 text-primary-01">{label}</span>}
    </label>
  );
}
