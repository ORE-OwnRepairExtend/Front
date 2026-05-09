import CommonButton from "../common/CommonButton";

type ProductManualProps = {
  content?: string;
  onPdfClick?: () => void;
};

export default function ProductManual({
  content = "",
  onPdfClick,
}: ProductManualProps) {
  return (
    <section className="flex w-full flex-col gap-[10px]">
      {/* 제목 + 버튼 */}
      <div className="flex items-center justify-between">
        <h3 className="text-body-sb-20 text-primary-01">매뉴얼</h3>

        <CommonButton
          variant="secondary"
          className="py-[10px]"
          onClick={onPdfClick}
        >
          PDF 원문
        </CommonButton>
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-[10px] text-body-m-16">{content}</div>
    </section>
  );
}
