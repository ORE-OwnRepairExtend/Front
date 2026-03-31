export type ProductStatus = "expired" | "danger" | "imminent" | "valid";

export type ProductSummary = {
  productId: string;
  productName: string;
  nickname: string;
  isFavorite: boolean;
  isRepair: boolean;
  purchaseDate: string;
  createdAt: string;
};
