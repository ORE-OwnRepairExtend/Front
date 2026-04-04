type RepairDetailContentProps = {
  title: string;
  repairDate: string;
  content: string;
  price: string;
  shopName: string;
  receiptImageUrl?: string;
};

export default function RepairDetailContent({
  title,
  repairDate,
  content,
  price,
  shopName,
  receiptImageUrl,
}: RepairDetailContentProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-[10px] px-[10px] py-[15px]">
        {/* 수리명 */}
        <div className="flex flex-col gap-[6px]">
          <h2 className="text-title-main text-primary-02">{title}</h2>
        </div>

        {/* 수리일자 및 내용 */}
        <div className="flex flex-col gap-[10px]">
          <span className="text-body-sb-20 text-primary-01">
            수리일자 - {repairDate}
          </span>
          <p className="text-body-m-16">{content}</p>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />

        {/* 수리 가격 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">수리 가격</span>
          <span className="text-body-m-16">{price.toLocaleString()}원</span>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />

        {/* 수리 대리점 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">수리 대리점</span>
          <span className="text-body-m-16">{shopName}</span>
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />
        {/* 영수증 */}
        <div className="flex flex-col gap-[10px] px-[10px]">
          <span className="text-body-sb-16 text-primary-01">영수증</span>

          {receiptImageUrl ? (
            <div className="w-fit overflow-hidden rounded-[8px]">
              <img
                src={receiptImageUrl}
                alt="영수증 이미지"
                className="max-w-[220px] h-auto object-contain"
              />
            </div>
          ) : (
            <span className="text-body-m-16 text-gray-01">
              등록된 영수증 이미지가 없습니다.
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-[2px] bg-gray-02" />
      </div>
    </section>
  );
}
