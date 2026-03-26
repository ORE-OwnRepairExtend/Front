import type { FavoriteItem, ProductSummary } from "../types/product";

export const mockProductListResponse: ProductSummary[] = [
  {
    productId: "111e8400-e29b-41d4-a716-446655440001",
    productName: "LG 에어컨",
    nickname: "우리집 에어컨",
    purchaseDate: "2026-03-20",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440002",
    productName: "삼성 냉장고",
    nickname: "주방 냉장고",
    purchaseDate: "2025-11-14",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440003",
    productName: "다이슨 청소기",
    nickname: "거실 청소기",
    purchaseDate: "2024-08-01",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "111e8400-e29b-41d4-a716-446655440004",
    productName: "캐논 카메라",
    nickname: "여행용 카메라",
    purchaseDate: "2023-05-10",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
];

export const mockFavoriteItems: FavoriteItem[] = [
  {
    id: "111e8400-e29b-41d4-a716-446655440001",
    name: "우리집 에어컨",
    description: "LG 에어컨",
    status: "danger",
  },
  {
    id: "111e8400-e29b-41d4-a716-446655440002",
    name: "주방 냉장고",
    description: "삼성 냉장고",
    status: "imminent",
  },
  {
    id: "111e8400-e29b-41d4-a716-446655440003",
    name: "거실 청소기",
    description: "다이슨 청소기",
    status: "valid",
  },
  {
    id: "111e8400-e29b-41d4-a716-446655440004",
    name: "여행용 카메라",
    description: "캐논 카메라",
    status: "expired",
  },
];
