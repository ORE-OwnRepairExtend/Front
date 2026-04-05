import type { RepairDetail } from "../types/repair";

export const mockRepairHistoryResponse = [
  {
    repairId: "1",
    repairDate: "2026-03-20",
    repairContent: "렌즈 수리",
    repairCost: 64000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "2",
    repairDate: "2026-03-12",
    repairContent: "센서 점검",
    repairCost: 30000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "3",
    repairDate: "2026-02-03",
    repairContent: "셔터 수리",
    repairCost: 85000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "4",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "5",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "6",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "7",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "8",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "9",
    repairDate: "2026-03-01",
    repairContent: "배터리 교체",
    repairCost: 45000,
    repairImage: "https://s3-url",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
];

export const mockRepairDetailResponse: RepairDetail[] = [
  {
    repairId: "1",
    repairDate: "2026-03-20",
    repairTitle: "렌즈 수리",
    repairContent:
      "렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경 렌즈 변경",
    repairCost: 64000,
    repairShop: "삼성 강남서비스센터",
    receiptImageUrl: "/photos/receipt-example.png",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    repairId: "2",
    repairDate: "2026-03-24",
    repairTitle: "센서 점검",
    repairContent:
      "ㅇㅁㅎ노함자ㅏㅓㄹㅁㄷ짉ㅁ재댜럳ㅇ나ㅓ리나ㅓㄷ랴ㅐㄷㄱㄷ재ㅑㅔㅑㅐㅐ에",
    repairCost: 30000,
    repairShop: "삼성 송파서비스센터",
    receiptImageUrl: "/photos/receipt-example.png",
    createdAt: "2026-03-24T14:00:00+09:00",
  },
];
