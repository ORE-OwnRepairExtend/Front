import { type ChangeEvent, useEffect, useRef, useState } from "react";
import DeleteButton from "../common/DeleteButton";

import plusPrimaryIcon from "../../assets/icons/plus_primary.svg";

type ProductImageButtonProps = {
  imageUrl?: string | null;
  onFileSelect?: (file: File | null) => void;
};

export default function ProductImageButton({
  imageUrl,
  onFileSelect,
}: ProductImageButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl ?? "");

  useEffect(() => {
    setPreviewUrl(imageUrl ?? "");
  }, [imageUrl]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    onFileSelect?.(file);
  };

  const handleDelete = () => {
    setPreviewUrl("");
    onFileSelect?.(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
          <img src={plusPrimaryIcon} alt="추가" className="h-[90px] w-[90px]" />
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