import type {
  ProductSummary,
  WarrantyInfo,
  ProductWithStatus,
} from "../types/product";
import { getProductStatus } from "./productStatus";

export function mergeProductsWithWarranty(
  products: ProductSummary[],
  warranties: WarrantyInfo[],
): ProductWithStatus[] {
  return products.map((product) => {
    const warrantyInfo = warranties.find(
      (item) => item.productId === product.productId,
    );

    return {
      ...product,
      status: warrantyInfo
        ? getProductStatus(warrantyInfo.remainingDays)
        : "empty", // 보증 정보 없을 때 : empty
      warrantyInfo,
    };
  });
}
