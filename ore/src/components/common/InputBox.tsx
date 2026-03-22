type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ placeholder, value, onChange }: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        flex w-full items-center
        px-[20px] py-[7px]
        rounded-[10px]
        border-2 border-primary-01
        outline-none
        text-body-r-16 text-gray-01
      "
    />
  );
}
