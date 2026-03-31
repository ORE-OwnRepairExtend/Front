export type ProductStatus = "expired" | "danger" | "imminent" | "valid";

export type ProductSummary = {
  productId: string;
  productName: string;
  nickname: string;
  isFavorite: boolean;
  purchaseDate: string;
  createdAt: string;
};

export type FavoriteItem = {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
};
