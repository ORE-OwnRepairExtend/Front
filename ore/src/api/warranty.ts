import { api } from "./api";
import { getProductStatus } from "../utils/productStatus";
import type { ProductStatus } from "../types/product";

export type WarrantyResponse = {
  productId: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyEndDate: string;
  remainingDays: number;
};

export type ProductWarranty = WarrantyResponse & {
  status: ProductStatus;
};

export async function getProductWarranty(
  productId: string
): Promise<ProductWarranty> {
  const response = await api.get<WarrantyResponse>(
    `/products/${productId}/warranty`
  );

  const warranty = response.data;

  return {
    ...warranty,
    status: getProductStatus(warranty.remainingDays),
  };
}