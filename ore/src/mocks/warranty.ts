import type { WarrantyInfo } from "../types/product";

export const mockWarrantyListResponse: WarrantyInfo[] = [
  {
    productId: "1",
    purchaseDate: "2026-03-20",
    warrantyMonths: 12,
    warrantyEndDate: "2027-03-20",
    remainingDays: 350,
  },
  {
    productId: "2",
    purchaseDate: "2025-11-14",
    warrantyMonths: 12,
    warrantyEndDate: "2026-11-14",
    remainingDays: 30,
  },
  {
    productId: "3",
    purchaseDate: "2024-08-01",
    warrantyMonths: 12,
    warrantyEndDate: "2025-08-01",
    remainingDays: 6,
  },
  {
    productId: "4",
    purchaseDate: "2023-05-10",
    warrantyMonths: 12,
    warrantyEndDate: "2024-05-10",
    remainingDays: 0,
  },
];
