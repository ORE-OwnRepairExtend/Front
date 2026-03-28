type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
};

export default function SearchBar({
  placeholder = "Search Product...",
  value,
  onChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <div
      className="
        flex w-[364px] h-[60px]
        px-[20px] pt-[13px] pb-[12px]
        items-end gap-[10px]
        rounded-[20px] bg-white
      "
    >
      {/* 아이콘 */}
      <img src="/icons/search.svg" alt="검색" width={30} height={30} />

      {/* 입력창 */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1 bg-transparent outline-none
          text-[20px] font-light
          text-black
          placeholder:text-primary-02
          placeholder:font-light
          placeholder:text-[20px]
        "
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit?.();
          }
        }}
      />
    </div>
  );
}
