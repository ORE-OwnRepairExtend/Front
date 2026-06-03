import { useNavigate } from "react-router-dom";
import RepairHistoryCard from "../repair/RepairHistoryCard";

import forwardBlackIcon from "../../assets/icons/forword_black.svg";

type RepairInfoItem = {
  repairId: string;
  repairName: string;
  repairDate: string;
  price: string;
};

type ProductRepairInfoProps = {
  productId: string;
  repairHistories: RepairInfoItem[];
};

export default function ProductRepairInfo({
  productId,
  repairHistories,
}: ProductRepairInfoProps) {
  const navigate = useNavigate();

  return (
    <section className="flex w-full flex-col items-start gap-[10px] px-[10px]">
      {/* 상단 영역 */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-body-sb-20 text-primary-01">수리 이력</h3>

        <button
          type="button"
          onClick={() => navigate(`/products/${productId}/repairs`)}
          className="flex items-center gap-[15px] text-body-m-16 cursor-pointer"
        >
          더보기
          <img src={forwardBlackIcon} alt="더보기" height={24} />
        </button>
      </div>

      {/* 수리 이력 리스트 */}
      <div className="flex w-full flex-col gap-[10px]">
        {repairHistories.length === 0 ? (
          <div className="flex w-full items-center justify-center rounded-[20px] bg-white/50 px-[30px] py-[25px]">
            <p className="text-body-m-16 text-gray-01">
              등록된 수리 이력이 없습니다.
            </p>
          </div>
        ) : (
          repairHistories.map((repair) => (
            <RepairHistoryCard
              key={repair.repairId}
              repairName={repair.repairName}
              repairDate={repair.repairDate}
              price={repair.price}
              onClick={() =>
                navigate(`/products/${productId}/repairs/${repair.repairId}`)
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
