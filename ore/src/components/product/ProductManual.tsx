import { parseManualSummary } from "../../utils/parseManualSummary";
import CommonButton from "../common/CommonButton";

type ProductManualProps = {
  content?: string | null;
  onPdfClick?: () => void;
};

export default function ProductManual({
  content = "",
  onPdfClick,
}: ProductManualProps) {
  const parsedManual = content ? parseManualSummary(content) : null;

  const hasParsedManual =
    !!parsedManual &&
    (parsedManual.usage || parsedManual.maintenance || parsedManual.repair);

  return (
    <section className="flex w-full flex-col gap-[10px]">
      {/* 제목 + 버튼 */}
      <div className="flex items-center justify-between">
        <h3 className="text-body-sb-20 text-primary-01">매뉴얼</h3>

        {onPdfClick && (
          <CommonButton
            variant="secondary"
            className="py-[10px]"
            onClick={onPdfClick}
          >
            PDF 원문
          </CommonButton>
        )}
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-[15px] text-body-m-16">
        {!content ? (
          <p className="text-gray-01">등록된 매뉴얼 정보가 없습니다.</p>
        ) : hasParsedManual ? (
          <>
            {parsedManual.usage && (
              <div className="flex flex-col gap-[5px]">
                <p className="text-body-sb-16 text-primary-01">사용 방법</p>
                <p className="whitespace-pre-line text-gray-01">
                  {parsedManual.usage}
                </p>
              </div>
            )}

            {parsedManual.maintenance && (
              <div className="flex flex-col gap-[5px]">
                <p className="text-body-sb-16 text-primary-01">관리 방법</p>
                <p className="whitespace-pre-line text-gray-01">
                  {parsedManual.maintenance}
                </p>
              </div>
            )}

            {parsedManual.repair && (
              <div className="flex flex-col gap-[5px]">
                <p className="text-body-sb-16 text-primary-01">
                  고장/수리 안내
                </p>
                <p className="whitespace-pre-line text-gray-01">
                  {parsedManual.repair}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="whitespace-pre-line text-gray-01">{content}</p>
        )}
      </div>
    </section>
  );
}
