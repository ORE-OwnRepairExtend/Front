import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  RadialLinearScale,
  Tooltip,
} from "chart.js";

import { Doughnut, PolarArea } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

type Product = {
  productId: string;
  category: string;
  warrantyStatus: "none" | "valid" | "imminent" | "danger" | "expired";
};

type Props = {
  products: Product[];
};

export default function ProductStatistics({ products }: Props) {
  // 카테고리 통계
  const categoryCounts = products.reduce<Record<string, number>>(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;

      return acc;
    },
    {},
  );

  // 보증 상태 통계
  const warrantyMap = {
    none: 0,
    valid: 0,
    imminent: 0,
    danger: 0,
    expired: 0,
  };

  products.forEach((product) => {
    warrantyMap[product.warrantyStatus]++;
  });

  // 도넛 그래프 데이터
  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#A8D5BA",
          "#F6C6A8",
          "#AFCBFF",
          "#FFD966",
          "#D5A6BD",
          "#D9D9D9",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Polar Area 데이터
  const polarData = {
    labels: ["보증없음", "유효", "임박", "위험", "만료"],
    datasets: [
      {
        data: [
          warrantyMap.none,
          warrantyMap.valid,
          warrantyMap.imminent,
          warrantyMap.danger,
          warrantyMap.expired,
        ],
        backgroundColor: [
          "#D9D9D9",
          "#A8D5BA",
          "#FFE599",
          "#EA9999",
          "#8e8686",
        ],
        borderWidth: 0,
      },
    ],
  };

  //   라벨 커스텀
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "center" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 6,
          boxHeight: 6,
          padding: 8,
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="grid w-full gap-[20px]">
      {/* 카테고리 통계 */}
      <div
        className="
          flex flex-col items-center justify-center
          rounded-[20px] 
          bg-neutral-04
          p-[20px]
        "
      >
        <h3 className="mb-[10px] text-body-sb-16 text-primary-01">
          카테고리별 제품
        </h3>

        <div className="h-[220px] w-[260px]">
          <Doughnut data={doughnutData} options={commonOptions} />
        </div>
      </div>

      {/* 보증 통계 */}
      <div
        className="
          flex flex-col items-center justify-center
          rounded-[20px]
          bg-neutral-04
          p-[20px]
        "
      >
        <h3 className="mb-[20px] text-body-sb-16 text-primary-01">
          보증기간별 제품
        </h3>

        <div className="h-[220px] w-[260px]">
          <PolarArea data={polarData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
}
