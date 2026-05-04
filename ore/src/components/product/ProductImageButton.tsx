import { type ChangeEvent, useRef, useState } from "react";
import DeleteButton from "../common/DeleteButton";

type ProductImageButtonProps = {
  onFileSelect?: (file: File | null) => void;
};

export default function ProductImageButton({
  onFileSelect,
}: ProductImageButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);

    onFileSelect?.(file);
  };

  const handleDelete = () => {
    setPreviewUrl("");
    onFileSelect?.(null);
  };

  return (
    <div className="flex items-center gap-[10px]">
      {/* 이미지 버튼 */}
      <button
        type="button"
        onClick={handleClick}
        className="
          flex h-[150px] w-[150px]
          cursor-pointer items-center justify-center
          overflow-hidden rounded-[20px]
          bg-neutral-01
        "
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="제품 이미지"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="/icons/plus_primary.svg"
            alt="추가"
            className="h-[90px] w-[90px]"
          />
        )}
      </button>

      {/* 삭제 버튼 (이미지 있을 때만) */}
      {previewUrl && <DeleteButton onClick={handleDelete} />}

      {/* 숨겨진 input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
