type WarrantyStatus = "none" | "valid" | "imminent" | "danger" | "expired";

type MockStatisticsProduct = {
  productId: string;
  category: string;
  warrantyStatus: WarrantyStatus;
};

export const mockStatisticsProducts: MockStatisticsProduct[] = [
  // 모바일 기기
  {
    productId: "1",
    category: "모바일 기기",
    warrantyStatus: "valid",
  },
  {
    productId: "2",
    category: "모바일 기기",
    warrantyStatus: "danger",
  },
  {
    productId: "3",
    category: "모바일 기기",
    warrantyStatus: "valid",
  },
  {
    productId: "4",
    category: "모바일 기기",
    warrantyStatus: "imminent",
  },
  {
    productId: "5",
    category: "모바일 기기",
    warrantyStatus: "expired",
  },

  // PC 기기
  {
    productId: "6",
    category: "PC 기기",
    warrantyStatus: "valid",
  },
  {
    productId: "7",
    category: "PC 기기",
    warrantyStatus: "valid",
  },
  {
    productId: "8",
    category: "PC 기기",
    warrantyStatus: "danger",
  },
  {
    productId: "9",
    category: "PC 기기",
    warrantyStatus: "none",
  },
  {
    productId: "10",
    category: "PC 기기",
    warrantyStatus: "imminent",
  },

  // 생활가전
  {
    productId: "11",
    category: "생활가전",
    warrantyStatus: "valid",
  },
  {
    productId: "12",
    category: "생활가전",
    warrantyStatus: "valid",
  },
  {
    productId: "13",
    category: "생활가전",
    warrantyStatus: "expired",
  },
  {
    productId: "14",
    category: "생활가전",
    warrantyStatus: "danger",
  },

  // 주방 가전
  {
    productId: "15",
    category: "주방 가전",
    warrantyStatus: "valid",
  },
  {
    productId: "16",
    category: "주방 가전",
    warrantyStatus: "valid",
  },
  {
    productId: "17",
    category: "주방 가전",
    warrantyStatus: "imminent",
  },
  {
    productId: "18",
    category: "주방 가전",
    warrantyStatus: "danger",
  },
  {
    productId: "19",
    category: "주방 가전",
    warrantyStatus: "expired",
  },

  // 영상·음향
  {
    productId: "20",
    category: "영상·음향",
    warrantyStatus: "valid",
  },
  {
    productId: "21",
    category: "영상·음향",
    warrantyStatus: "valid",
  },
  {
    productId: "22",
    category: "영상·음향",
    warrantyStatus: "imminent",
  },
  {
    productId: "23",
    category: "영상·음향",
    warrantyStatus: "danger",
  },

  // 기타
  {
    productId: "24",
    category: "기타",
    warrantyStatus: "none",
  },
  {
    productId: "25",
    category: "기타",
    warrantyStatus: "danger",
  },
  {
    productId: "26",
    category: "기타",
    warrantyStatus: "expired",
  },
  {
    productId: "27",
    category: "기타",
    warrantyStatus: "valid",
  },
];
