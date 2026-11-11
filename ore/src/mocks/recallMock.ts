import type { RecallInfo } from "../types/recall";

export const mockRecalls: RecallInfo[] = [
  {
    recallId: "recall-001",
    productId: "mock-product-001",

    productName: "카메라",
    productDescription: "SONY-XXXX 디지털 카메라",
    productImageUrl: null,

    title: "제품 리콜 안내",

    images: ["/photos/recall-test-01.png", "/photos/recall-test-02.png"],

    riskDescription: ["제품 일부에서 부품 결함으로 인한 안전사고 발생 가능성"],

    actionDescription: [
      "해당 제품의 사용을 즉시 중단하고 제조사 서비스를 확인할 것",
      "문제가 발생하지 않았더라도 제조사 안내에 따라 점검 또는 교체를 받을 것",
    ],

    detailUrl: "https://www.safetykorea.kr",
  },
];
