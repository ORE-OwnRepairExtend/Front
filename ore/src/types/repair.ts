export type RepairHistory = {
  repairId: string;
  repairDate: string;
  repairContent: string;
  repairCost: number;
  repairImage: string;
  createdAt: string;
};

export type RepairDetail = {
  repairId: string;
  repairDate: string;
  repairTitle: string;
  repairContent: string;
  repairCost: number;
  repairShop: string;
  receiptImageUrl?: string;
  createdAt: string;
};
