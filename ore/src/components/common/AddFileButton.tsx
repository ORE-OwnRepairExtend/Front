type AddFileButtonProps = {
  title: string;
  accept?: string;
  onFileSelect: (file: File) => void;
};

export default function AddFileButton({
  title,
  accept = "image/*",
  onFileSelect,
}: AddFileButtonProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  return (
    <label
      className="
        inline-flex w-full cursor-pointer items-center justify-center gap-[10px]
        rounded-[15px] bg-primary-01
        px-[30px] py-[10px]
        text-white
      "
    >
      <img src="/icons/plus.svg" alt="추가하기" width={24} height={24} />
      <span>{title}</span>

      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
}
