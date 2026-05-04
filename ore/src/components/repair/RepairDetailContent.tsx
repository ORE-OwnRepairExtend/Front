import AddFileButton from "../common/AddFileButton";
import CommonInputBox from "../common/CommonInputBox";

type RepairDetailContentProps = {
  isEditMode?: boolean;
  title: string;
  repairDate: string;
  content: string;
  price: string;
  shopName: string;
  receiptImageUrl?: string;
  onTitleChange?: (value: string) => void;
  onRepairDateChange?: (value: string) => void;
  onContentChange?: (value: string) => void;
  onPriceChange?: (value: string) => void;
  onShopNameChange?: (value: string) => void;
  onReceiptImageChange?: (file: File) => void;
};

export default function RepairDetailContent({
  isEditMode = false,
  title,
  repairDate,
  content,
  price,
  shopName,
  receiptImageUrl,
  onTitleChange,
  onRepairDateChange,
  onContentChange,
  onPriceChange,
  onShopNameChange,
  onReceiptImageChange,
}: RepairDetailContentProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onReceiptImageChange?.(file);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-[10px] px-[10px] py-[15px]">
        {/* 수리명 */}
        <div className="flex flex-col gap-[6px]">
          {isEditMode ? (
            <CommonInputBox
              variant="title"
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              placeholder="수리명을 입력하세요."
            />
          ) : (
            <h2 className="text-title-main text-primary-02">{title}</h2>
          )}
        </div>

        {/* 수리일자 및 내용 */}
        <div className="mt-[20px] flex flex-col gap-[10px]">
          {isEditMode ? (
            <span className="text-body-sb-20 text-primary-01">
              수리일자 -{" "}
              {
                <input
                  type="date"
                  value={repairDate}
                  onChange={(e) => onRepairDateChange?.(e.target.value)}
                  className="border rounded-[10px] border-[2px] border-primary-01 px-[20px] py-[7px] text-body-r-16 text-gray-01 focus:outline-none focus:ring-0"
                />
              }
            </span>
          ) : (
            <span className="text-body-sb-20 text-primary-01">
              수리일자 - {repairDate}
            </span>
          )}

          {isEditMode ? (
            <CommonInputBox
              variant="content"
              multiline
              value={content}
              onChange={(e) => onContentChange?.(e.target.value)}
              placeholder="수리 내용을 입력하세요."
              className="h-[150px]"
            />
          ) : (
            <p className="text-body-m-16">{content}</p>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />

        {/* 수리 가격 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">수리 가격</span>

          {isEditMode ? (
            <CommonInputBox
              variant="content"
              value={price}
              onChange={(e) => onPriceChange?.(e.target.value)}
              placeholder="수리 가격을 입력하세요."
            />
          ) : (
            <span className="text-body-m-16">{price}</span>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />

        {/* 수리 대리점 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">수리 대리점</span>

          {isEditMode ? (
            <CommonInputBox
              variant="content"
              value={shopName}
              onChange={(e) => onShopNameChange?.(e.target.value)}
              placeholder="수리 대리점을 입력하세요."
            />
          ) : (
            <span className="text-body-m-16">{shopName}</span>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />

        {/* 영수증 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">영수증</span>
          <div className="relative">
            {receiptImageUrl ? (
              <>
                <div className="w-fit overflow-hidden rounded-[8px]">
                  <img
                    src={receiptImageUrl}
                    alt="영수증 이미지 미리보기"
                    className="h-auto max-w-[220px] object-contain"
                  />
                </div>

                {isEditMode && (
                  <label
                    className="
        absolute inset-0
        flex items-center justify-center
        cursor-pointer
        rounded-[10px]
        hover:bg-black/40
      "
                  >
                    <span className="px-[16px] py-[6px] rounded-[10px] bg-primary-01 text-body-m-10 text-white">
                      이미지 변경
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </>
            ) : isEditMode ? (
              <AddFileButton
                title="이미지 업로드"
                onFileSelect={(file) => onReceiptImageChange?.(file)}
              />
            ) : (
              <span className="text-body-m-16 text-gray-01">
                등록된 영수증 이미지가 없습니다.
              </span>
            )}
          </div>
        </div>

        <div className="h-[2px] w-full bg-gray-02" />
      </div>
    </section>
  );
}
