import { type ChangeEvent, useRef, useState } from "react";
import DeleteButton from "../common/DeleteButton";

type ProductImageButtonProps = {
  imageUrl?: string;
  onFileSelect?: (file: File | null) => void;
};

export default function ProductImageButton({
  imageUrl,
  onFileSelect,
}: ProductImageButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(imageUrl ?? "");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);
    onFileSelect?.(file);

    e.target.value = "";
  };

  const handleDelete = () => {
    setPreviewUrl("");
    onFileSelect?.(null);
  };

  return (
    <div className="relative h-[150px] w-[150px]">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          flex h-full w-full
          cursor-pointer items-center justify-center
          overflow-hidden rounded-[20px]
          bg-neutral-01
        "
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="제품 이미지 미리보기"
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

      {previewUrl && (
        <>
          <label
            className="
              absolute inset-0
              flex cursor-pointer items-center justify-center
              rounded-[20px]
              opacity-0 hover:bg-black/40 hover:opacity-100
            "
          >
            <span className="rounded-[10px] bg-primary-01 px-[16px] py-[6px] text-body-m-10 text-white">
              이미지 변경
            </span>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <DeleteButton
            className="absolute right-2 top-2"
            onClick={handleDelete}
          />
        </>
      )}

      {!previewUrl && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}
