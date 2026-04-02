import type { ProductSummary } from "../types/product";

export const mockProductListResponse: ProductSummary[] = [
  {
    productId: "1",
    productName: "SONY-RX1R III 컴팩트 카메라",
    nickname: "카메라",
    imageUrl: "/photos/camera.png",
    isFavorite: true,
    hasRepairHistory: true,
    purchaseDate: "2026-03-20",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "2",
    productName: "삼성 냉장고",
    nickname: "주방 냉장고",
    imageUrl: "/photos/refrigerator.png",
    isFavorite: true,
    hasRepairHistory: true,
    purchaseDate: "2025-11-14",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "3",
    productName: "APPLE-iPhone Air",
    nickname: "내 폰",
    imageUrl: "/photos/phone.png",
    isFavorite: true,
    hasRepairHistory: true,
    purchaseDate: "2024-08-01",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
  {
    productId: "4",
    productName: "APPLE-AirPods Pro 3",
    nickname: "콩나물",
    imageUrl: "/photos/airpods.png",
    isFavorite: true,
    hasRepairHistory: true,
    purchaseDate: "2023-05-10",
    createdAt: "2026-03-24T12:00:00+09:00",
  },
];
