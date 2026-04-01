import type { ProductStatus } from "../types/product";

export function getProductStatus(remainingDays: number): ProductStatus {
  if (remainingDays <= 0) {
    return "expired";
  }

  if (remainingDays <= 7) {
    return "danger";
  }

  if (remainingDays <= 31) {
    return "imminent";
  }

  return "valid";
}
