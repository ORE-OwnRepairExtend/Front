import type { ProductSummary } from "../types/product";

export const mockProductListResponse: ProductSummary[] = [
  {
    productId: "111e8400-e29b-41d4-a716-446655440001",
    productName: "LG 에어컨",
    nickname: "우리집 에어컨",
    isFavorite: true,
    isRepair: true,
    purchaseDate: "2026-03-20",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440002",
    productName: "삼성 냉장고",
    nickname: "주방 냉장고",
    isFavorite: true,
    isRepair: true,
    purchaseDate: "2025-11-14",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440003",
    productName: "다이슨 청소기",
    nickname: "거실 청소기",
    isFavorite: true,
    isRepair: true,
    purchaseDate: "2024-08-01",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440004",
    productName: "캐논 카메라",
    nickname: "여행용 카메라",
    isFavorite: true,
    isRepair: true,
    purchaseDate: "2023-05-10",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
];
